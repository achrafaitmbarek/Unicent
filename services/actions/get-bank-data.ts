'use server';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth ,format} from "date-fns";

export async function getAccountBalance(){
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Authentication required');
    }

    const user = await prisma.user.findUnique({
        where:{
            email: session.user.email
        }
    });
    if (!user) {
        throw new Error('User not found');
    }

    const accountBalance = await prisma.bankAccount.findMany({
        where: {
            connection: {
                userId: user.id
            }
        },
        select:{
            balance: true,
            currencySymbol: true
        }
    });
    return accountBalance;
}


export async function getTotalExpenses() {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
  
    const expenses = await prisma.transaction.aggregate({
      where: {
        flow: 'EXPENSE',
        account: {
          connection: {
            userId: user.id
          }
        }
      },
      _sum: {
        value: true
      }
    });
  
    const firstAccount = await prisma.bankAccount.findFirst({
      where: {
        connection: { userId: user.id }
      },
      select: { currencySymbol: true }
    });
  
    return {
      total: Math.abs(expenses._sum.value || 0),
      currencySymbol: firstAccount?.currencySymbol || '$'
    };
  }

  export async function getTotalIncome() {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
  
    const income = await prisma.transaction.aggregate({
      where: {
        flow: 'INCOME',
        account: {
          connection: {
            userId: user.id
          }
        }
      },
      _sum: {
        value: true
      }
    });
  
    const firstAccount = await prisma.bankAccount.findFirst({
      where: {
        connection: { userId: user.id }
      },
      select: { currencySymbol: true }
    });
  
    return {
      total: income._sum.value || 0,
      currencySymbol: firstAccount?.currencySymbol || '$'
    };
  }

export async function getCurrentMonthSpend() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('Authentication required');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);

  const monthExpenses = await prisma.transaction.aggregate({
    where: {
      flow: 'EXPENSE',
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth
      },
      account: {
        connection: {
          userId: user.id
        }
      }
    },
    _sum: {
      value: true
    }
  });


  const firstAccount = await prisma.bankAccount.findFirst({
    where: {
      connection: { userId: user.id }
    },
    select: { currencySymbol: true }
  });

  return {
    total: Math.abs(monthExpenses._sum.value || 0), 
    currencySymbol: firstAccount?.currencySymbol || '$',
    monthName: now.toLocaleString('default', { month: 'long' })
  };
}


export async function getMonthlySpendData(numberOfMonths = 5) {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
  
    const now = new Date();
    const monthlyData = [];
    
    for (let i = 0; i < numberOfMonths; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      
      const firstDay = startOfMonth(date);
      const lastDay = endOfMonth(date);
      
      // Get expenses for this month
      const monthExpenses = await prisma.transaction.aggregate({
        where: {
          flow: 'EXPENSE',
          date: {
            gte: firstDay,
            lte: lastDay
          },
          account: {
            connection: {
              userId: user.id
            }
          }
        },
        _sum: {
          value: true
        }
      });
      
      // Get income for this month
      const monthIncome = await prisma.transaction.aggregate({
        where: {
          flow: 'INCOME',
          date: {
            gte: firstDay,
            lte: lastDay
          },
          account: {
            connection: {
              userId: user.id
            }
          }
        },
        _sum: {
          value: true
        }
      });
      
      monthlyData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        expenses: Math.abs(monthExpenses._sum.value || 0),
        income: monthIncome._sum.value || 0
      });
    }
  
    const firstAccount = await prisma.bankAccount.findFirst({
      where: {
        connection: { userId: user.id }
      },
      select: { currencySymbol: true }
    });
  
    return {
      data: monthlyData.reverse(),
      currencySymbol: firstAccount?.currencySymbol || '$'
    };
  }

  export async function getCategorySpendData(year?: number, month?: number) {
    const session = await auth()
    if (!session?.user?.email) throw new Error('Authentication required')
  
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) throw new Error('User not found')
  
    // figure out the period
    const now = new Date()
    const y = year ?? now.getFullYear()
    const m = month ?? now.getMonth() + 1   // 1–12
    const firstDay = startOfMonth(new Date(y, m - 1))
    const lastDay  = endOfMonth(new Date(y, m - 1))
  
    // total for this month
    const totalAgg = await prisma.transaction.aggregate({
      where: {
        flow: 'EXPENSE',
        date: { gte: firstDay, lte: lastDay },
        account: { connection: { userId: user.id } }
      },
      _sum: { value: true }
    })
    const totalAmount = Math.abs(totalAgg._sum.value || 0)
  
    // breakdown by category for this month
    const raw = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        flow: 'EXPENSE',
        date: { gte: firstDay, lte: lastDay },
        account: { connection: { userId: user.id } }
      },
      _sum: { value: true }
    })
  
    const categories = raw
      .map(cat => ({
        name: cat.category,
        amount: Math.abs(cat._sum.value || 0),
        value: Math.round((Math.abs(cat._sum.value || 0) / totalAmount) * 100)
      }))
      .filter(cat => cat.value > 0)
      .sort((a, b) => b.value - a.value)
  
    const firstAccount = await prisma.bankAccount.findFirst({
      where: { connection: { userId: user.id } },
      select: { currencySymbol: true }
    })
  
    return {
      categories,
      total: totalAmount,
      currencySymbol: firstAccount?.currencySymbol || '$'
    }
  }

  


  export async function getMonthlyIncomeData(numberOfMonths = 9) {
      const session = await auth();
      if (!session?.user?.email) {
        throw new Error('Authentication required');
      }
    
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Wrap the expensive calculations in a cache function
      const getMonthlyIncomeForUser = 
        async (userId: string, months: number) => {
          console.log('Fetching monthly income data for user:', userId);
          const now = new Date();
          const monthlyData = [];
          
          for (let i = 0; i < months; i++) {
            const date = new Date();
            date.setMonth(now.getMonth() - i);
            
            const firstDay = startOfMonth(date);
            const lastDay = endOfMonth(date);
            
            const monthIncome = await prisma.transaction.aggregate({
              where: {
                flow: 'INCOME',
                date: {
                  gte: firstDay,
                  lte: lastDay
                },
                account: {
                  connection: {
                    userId: userId
                  }
                }
              },
              _sum: {
                value: true
              }
            });
            
            monthlyData.push({
              month: format(date, 'MMM'),
              income: monthIncome._sum.value || 0,
              year: format(date, 'yyyy')
            });
          }
          
          const firstAccount = await prisma.bankAccount.findFirst({
            where: {
              connection: { userId }
            },
            select: { currencySymbol: true }
          });
        
          return {
            data: monthlyData.reverse(),
            currencySymbol: firstAccount?.currencySymbol || '$',
            maxValue: Math.max(...monthlyData.map(item => item.income))
          };
        }
      return await getMonthlyIncomeForUser(user.id, numberOfMonths);
  }

  export async function getMonthlyExpenseData(numberOfMonths = 9) {
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const getMonthlyExpenseForUser = async (userId: string, months: number) => {
        console.log('Fetching monthly expense data for user:', userId);
        const now = new Date();
        const monthlyData = [];
        
        for (let i = 0; i < months; i++) {
          const date = new Date();
          date.setMonth(now.getMonth() - i);
          
          const firstDay = startOfMonth(date);
          const lastDay = endOfMonth(date);
          
          const monthExpense = await prisma.transaction.aggregate({
            where: {
              flow: 'EXPENSE',
              date: {
                gte: firstDay,
                lte: lastDay
              },
              account: {
                connection: {
                  userId: userId
                }
              }
            },
            _sum: {
              value: true
            }
          });
          
          const expenseValue = Math.abs(monthExpense._sum.value || 0);
          monthlyData.push({
            month: format(date, 'MMM'),
            expense: expenseValue,
            year: format(date, 'yyyy')
          });
        }
        
        const firstAccount = await prisma.bankAccount.findFirst({
          where: {
            connection: { userId }
          },
          select: { currencySymbol: true }
        });
      
        return {
          data: monthlyData.reverse(),
          currencySymbol: firstAccount?.currencySymbol || '$',
          maxValue: Math.max(...monthlyData.map(item => item.expense))
        };
      }
  

    return await getMonthlyExpenseForUser(user.id, numberOfMonths);
}

  