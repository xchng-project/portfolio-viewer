import Link from 'next/link'

const Home = () => {
    return <main className="min-h-[calc(100vh-57px)] bg-background">
        <div className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-6xl flex-col justify-center px-4 py-12 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
                <section className="max-w-2xl">
                    <p className="mb-4 text-sm font-semibold text-primary">Aave portfolio operations</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Review positions, choose a network, act with context.
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-7 text-muted">
                        Portfolio Viewer gives wallet-connected users a focused place to inspect Aave supplies,
                        borrows, available markets, and transaction readiness across supported networks.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/aave"
                            className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                        >
                            Open Aave dashboard
                        </Link>
                    </div>
                </section>
                <section className="rounded-xl border bg-surface p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">Workflow</h2>
                            <p className="mt-1 text-xs text-muted">Connect before submitting transactions.</p>
                        </div>
                        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                            Ready
                        </span>
                    </div>
                    <div className="space-y-3">
                        {['Select supported network', 'Review supplies and borrows', 'Supply, borrow, repay, or withdraw'].map((item, index) => (
                            <div key={item} className="flex items-center gap-3 rounded-lg bg-surface-subtle p-3">
                                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface text-xs font-semibold text-muted-strong">
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-muted-strong">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    </main>
}

export default Home
