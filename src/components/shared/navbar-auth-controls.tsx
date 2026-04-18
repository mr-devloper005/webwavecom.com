'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'

export function NavbarAuthControls() {
  const { user, logout } = useAuth()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden min-w-0 flex-col items-end text-right sm:flex">
        <span className="max-w-[140px] truncate text-sm font-medium text-slate-900">{user?.name}</span>
        <span className="max-w-[180px] truncate text-xs text-slate-500">{user?.email}</span>
      </div>
      <Avatar className="h-9 w-9 shrink-0 border border-slate-200">
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={logout}
        className="shrink-0 rounded-full border-slate-200 bg-white px-3 text-slate-800 shadow-sm hover:bg-slate-50 sm:px-4"
      >
        <LogOut className="mr-1.5 h-4 w-4 sm:mr-2" aria-hidden />
        Sign out
      </Button>
    </div>
  )
}
