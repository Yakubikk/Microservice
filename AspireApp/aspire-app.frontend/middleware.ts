import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from '@/types/entities'

// Конфигурация маршрутов
const PUBLIC_ROUTES = ['/login', '/register', '/']
const AUTH_ROUTES = ['/dashboard', '/profile']
const ROLE_ROUTES: Record<string, Role[]> = {
  '/admin': [Role.Admin],
  '/moderator': [Role.Moderator, Role.Admin]
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value

  // 1. Проверка публичных маршрутов
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // 2. Если нет токена - редирект на логин
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const user = await getUser(accessToken);

    // 3. Проверка ролей для защищенных маршрутов
    for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route) && !roles.some(role => user.roles.includes(role))) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // 4. Для авторизованных пользователей
    if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Auth error:', error)
    // Удаляем невалидные куки
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    return response
  }
}

// Конфигурация matcher (для оптимизации)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Исключаем статику
  ],
}
