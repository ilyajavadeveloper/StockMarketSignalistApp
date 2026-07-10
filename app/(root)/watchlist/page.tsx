import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Building2,
    CalendarDays,
    Clock3,
    Search,
    Sparkles,
    TrendingUp,
} from "lucide-react";

import { auth } from "@/lib/better-auth/auth";
import { getCurrentUserWatchlist } from "@/lib/actions/watchlist.actions";
import WatchlistButton from "@/components/WatchlistButton";

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
};

const getStockInitials = (company: string, symbol: string) => {
    if (!company.trim()) {
        return symbol.slice(0, 2).toUpperCase();
    }

    const words = company
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const WatchlistPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const stocks = await getCurrentUserWatchlist();

    const newestStock = stocks[0];

    const uniqueCompanies = new Set(
        stocks.map((stock) => stock.company.trim().toLowerCase())
    ).size;

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
                <div className="absolute left-1/2 top-[-280px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[140px]" />

                <div className="absolute right-[-180px] top-24 h-[360px] w-[360px] rounded-full bg-emerald-500/5 blur-[120px]" />
            </div>

            <div className="mx-auto w-full max-w-7xl">
                {/* Hero */}
                <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-transparent p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-yellow-400/10 blur-[100px]" />

                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
                                <Sparkles className="h-3.5 w-3.5" />
                                Personal market tracker
                            </div>

                            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                                Your stock
                                <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                    watchlist.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                                Keep every company you are researching in one
                                clean space. Open any stock to view its market
                                profile, performance and deeper financial data.
                            </p>
                        </div>

                        <Link
                            href="/"
                            className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20"
                        >
                            <Search className="h-4 w-4" />
                            Find more stocks
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </section>

                {/* Stats */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                                    Total stocks
                                </p>

                                <p className="mt-3 text-3xl font-bold text-white">
                                    {stocks.length}
                                </p>
                            </div>

                            <div className="rounded-xl border border-yellow-400/15 bg-yellow-400/10 p-3 text-yellow-300">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            Companies currently tracked
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                                    Companies
                                </p>

                                <p className="mt-3 text-3xl font-bold text-white">
                                    {uniqueCompanies}
                                </p>
                            </div>

                            <div className="rounded-xl border border-blue-400/15 bg-blue-400/10 p-3 text-blue-300">
                                <Building2 className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            Unique businesses saved
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                                    Latest addition
                                </p>

                                <p className="mt-3 truncate text-3xl font-bold text-white">
                                    {newestStock?.symbol ?? "—"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3 text-emerald-300">
                                <Clock3 className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="mt-4 truncate text-sm text-gray-500">
                            {newestStock?.company ?? "No stocks added yet"}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                                    Market status
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.7)]" />

                                    <p className="text-lg font-bold text-white">
                                        Ready
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-purple-400/15 bg-purple-400/10 p-3 text-purple-300">
                                <Activity className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                            Open a stock for live data
                        </p>
                    </div>
                </section>

                {/* Section header */}
                <section className="mb-5 mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                            Saved companies
                        </p>

                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Stocks you are watching
                        </h2>
                    </div>

                    {stocks.length > 0 && (
                        <p className="text-sm text-gray-500">
                            {stocks.length}{" "}
                            {stocks.length === 1 ? "company" : "companies"} in
                            your list
                        </p>
                    )}
                </section>

                {stocks.length === 0 ? (
                    <section className="relative overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-white/[0.035] px-6 py-20 text-center">
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/5 blur-[80px]" />

                        <div className="relative">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300 shadow-lg shadow-yellow-400/5">
                                <TrendingUp className="h-9 w-9" />
                            </div>

                            <h2 className="mt-7 text-2xl font-bold text-white">
                                Your watchlist is waiting
                            </h2>

                            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
                                Save companies you want to follow and return to
                                them without searching again.
                            </p>

                            <Link
                                href="/"
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
                            >
                                <Search className="h-4 w-4" />
                                Search stocks
                            </Link>
                        </div>
                    </section>
                ) : (
                    <ul className="grid gap-5 lg:grid-cols-2">
                        {stocks.map((stock, index) => (
                            <li
                                key={stock.symbol}
                                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-transparent p-5 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/25 hover:shadow-2xl hover:shadow-black/50 sm:p-6"
                            >
                                <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-yellow-400/0 blur-[60px] transition duration-300 group-hover:bg-yellow-400/10" />

                                <div className="relative">
                                    <div className="flex items-start justify-between gap-4">
                                        <Link
                                            href={`/stocks/${encodeURIComponent(
                                                stock.symbol
                                            )}`}
                                            className="flex min-w-0 flex-1 items-center gap-4"
                                        >
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/15 bg-gradient-to-br from-yellow-300 to-amber-500 text-sm font-black text-black shadow-lg shadow-yellow-400/10">
                                                {getStockInitials(
                                                    stock.company,
                                                    stock.symbol
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl font-bold tracking-tight text-white transition group-hover:text-yellow-300">
                                                        {stock.symbol}
                                                    </h3>

                                                    <ArrowUpRight className="h-4 w-4 text-gray-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-yellow-300" />
                                                </div>

                                                <p className="mt-1 truncate text-sm text-gray-400">
                                                    {stock.company}
                                                </p>
                                            </div>
                                        </Link>

                                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                                            #{String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <div className="my-5 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3.5">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <CalendarDays className="h-4 w-4" />

                                                <span className="text-xs font-medium">
                                                    Added
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm font-semibold text-gray-200">
                                                {formatDate(stock.addedAt)}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3.5">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <TrendingUp className="h-4 w-4" />

                                                <span className="text-xs font-medium">
                                                    Tracking
                                                </span>
                                            </div>

                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                                <p className="text-sm font-semibold text-gray-200">
                                                    Active
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <Link
                                            href={`/stocks/${encodeURIComponent(
                                                stock.symbol
                                            )}`}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-300"
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            View stock details
                                        </Link>

                                        <WatchlistButton
                                            symbol={stock.symbol}
                                            company={stock.company}
                                            isInWatchlist
                                            showTrashIcon
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default WatchlistPage;