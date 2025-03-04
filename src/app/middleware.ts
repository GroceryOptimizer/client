import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log('Middleware executed:', request.nextUrl.pathname);
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/shop', request.url));
    }
    return NextResponse.next();
}
