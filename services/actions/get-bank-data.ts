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

    export async function getCategorySpendData() {
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
  
    const totalExpenses = await prisma.transaction.aggregate({
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
    
    const totalAmount = Math.abs(totalExpenses._sum.value || 0);
    
    const categoryData = await prisma.transaction.groupBy({
      by: ['category'],
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
    
    const chartData = categoryData.map(cat => ({
      name: cat.category,
      value: Math.round((Math.abs(cat._sum.value || 0) / totalAmount) * 100),
      amount: Math.abs(cat._sum.value || 0)
    }))
    .filter(cat => cat.value > 0) 
    .sort((a, b) => b.value - a.value); 

    const firstAccount = await prisma.bankAccount.findFirst({
      where: {
        connection: { userId: user.id }
      },
      select: { currencySymbol: true }
    });
  
    return {
      categories: chartData,
      total: totalAmount,
      currencySymbol: firstAccount?.currencySymbol || '$'
    };
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
  
    const now = new Date();
    const monthlyData = [];
    
    for (let i = 0; i < numberOfMonths; i++) {
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
              userId: user.id
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
        connection: { userId: user.id }
      },
      select: { currencySymbol: true }
    });
  
    return {
      data: monthlyData.reverse(),
      currencySymbol: firstAccount?.currencySymbol || '$',
      maxValue: Math.max(...monthlyData.map(item => item.income))
    };
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
  
    const now = new Date();
    const monthlyData = [];
    
    for (let i = 0; i < numberOfMonths; i++) {
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
              userId: user.id
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
        connection: { userId: user.id }
      },
      select: { currencySymbol: true }
    });
  
    return {
      data: monthlyData.reverse(),
      currencySymbol: firstAccount?.currencySymbol || '$',
      maxValue: Math.max(...monthlyData.map(item => item.expense))
    };
  }