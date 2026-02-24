import Link from 'next/link'
import {UserMenuBlock} from '@/src/app/components/blocks'

const Header = () => {
    return <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-16 py-4">
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
                >Главная</Link>
                <Link
                    href="/aave"
                    className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
                >AAVE</Link>
            </div>
            <UserMenuBlock/>
        </nav>
    </header>
}

export default Header
