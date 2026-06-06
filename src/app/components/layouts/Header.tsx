import Link from 'next/link'
import {UserMenuBlock} from '@/src/app/components/blocks'

const Header = () => {
    return <header className="sticky top-0 z-30 border-b bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-5">
                <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary text-xs font-bold text-white">
                        PV
                    </span>
                    <span className="hidden sm:inline">Portfolio Viewer</span>
                </Link>
                <div className="h-6 w-px bg-border"/>
                <Link
                    href="/"
                    className="text-sm font-medium text-muted hover:text-foreground"
                >Home</Link>
                <Link
                    href="/aave"
                    className="text-sm font-medium text-muted hover:text-foreground"
                >Aave</Link>
            </div>
            <UserMenuBlock/>
        </nav>
    </header>
}

export default Header
