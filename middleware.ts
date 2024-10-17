// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { auth } from './auth'

// export default auth((req) => {
//   const isAuthPageRoute = req.nextUrl.pathname.startsWith('/login') || 
//                           req.nextUrl.pathname.startsWith('/register')
//   const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')
//   const isApiRoute = req.nextUrl.pathname.startsWith('/api')

 
//   if (isDashboardRoute && !req.auth) {
//     return NextResponse.redirect(new URL('/login', req.url))
//   }

//   if (isAuthPageRoute && req.auth) {
//     return NextResponse.redirect(new URL('/dashboard', req.url))
//   }

//   if (isApiRoute && !req.auth) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }
//   return NextResponse.next()
// })


// export const config = {
//   matcher: ['/dashboard/:path*', '/api/:path*', '/login', '/register'],
// }