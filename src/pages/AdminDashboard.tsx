import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Eye, Film, TrendingUp, LogOut, Activity,
  BarChart3, Clock, Globe, Megaphone
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import AdminAdManager from "@/components/AdminAdManager";
import AdminSiteSettings from "@/components/AdminSiteSettings";

interface Stats {
  activeNow: number;
  todayViews: number;
  totalViews: number;
  uniqueSessions: number;
}

interface MovieStat {
  movie_title: string;
  count: number;
}

interface HourlyData {
  hour: string;
  views: number;
}

const CHART_COLORS = [
  "hsl(358, 93%, 47%)",
  "hsl(192, 100%, 50%)",
  "hsl(51, 100%, 50%)",
  "hsl(145, 60%, 55%)",
  "hsl(280, 70%, 55%)",
  "hsl(30, 90%, 55%)",
];

type Tab = "analytics" | "ads" | "settings";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ activeNow: 0, todayViews: 0, totalViews: 0, uniqueSessions: 0 });
  const [topMovies, setTopMovies] = useState<MovieStat[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [topPages, setTopPages] = useState<{ page: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  useEffect(() => {
    checkAuth();
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/pf-ctrl-9x7k"); return; }
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) { navigate("/pf-ctrl-9x7k"); }
  };

  const fetchData = async () => {
    await supabase.rpc("cleanup_old_sessions");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const [activeRes, todayViewsRes, totalViewsRes, uniqueRes, moviesRes, pagesRes] = await Promise.all([
      supabase.from("active_sessions").select("id", { count: "exact", head: true }),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", todayISO),
      supabase.from("page_views").select("id", { count: "exact", head: true }),
      supabase.from("page_views").select("session_id").gte("created_at", todayISO),
      supabase.from("movie_clicks").select("movie_title"),
      supabase.from("page_views").select("page"),
    ]);

    setStats({
      activeNow: activeRes.count || 0,
      todayViews: todayViewsRes.count || 0,
      totalViews: totalViewsRes.count || 0,
      uniqueSessions: new Set((uniqueRes.data || []).map((r: any) => r.session_id)).size,
    });

    const movieCounts: Record<string, number> = {};
    (moviesRes.data || []).forEach((r: any) => {
      movieCounts[r.movie_title] = (movieCounts[r.movie_title] || 0) + 1;
    });
    setTopMovies(
      Object.entries(movieCounts)
        .map(([movie_title, count]) => ({ movie_title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    );

    const pageCounts: Record<string, number> = {};
    (pagesRes.data || []).forEach((r: any) => {
      pageCounts[r.page] = (pageCounts[r.page] || 0) + 1;
    });
    setTopPages(
      Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
    );

    const hourly: Record<string, number> = {};
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const h = new Date(now.getTime() - i * 3600000);
      hourly[`${h.getHours().toString().padStart(2, "0")}:00`] = 0;
    }
    const { data: hourlyViews } = await supabase
      .from("page_views")
      .select("created_at")
      .gte("created_at", new Date(now.getTime() - 24 * 3600000).toISOString());

    (hourlyViews || []).forEach((r: any) => {
      const h = `${new Date(r.created_at).getHours().toString().padStart(2, "0")}:00`;
      if (hourly[h] !== undefined) hourly[h]++;
    });
    setHourlyData(Object.entries(hourly).map(([hour, views]) => ({ hour, views })));
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/pf-ctrl-9x7k");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-bg border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">PlayFlix Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex gap-1 bg-foreground/[0.04] rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("ads")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "ads"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Megaphone className="w-4 h-4" /> Ad Management
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === "analytics" ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={<Users className="w-5 h-5" />} label="Active Now" value={stats.activeNow} accent="primary" pulse />
              <StatCard icon={<Eye className="w-5 h-5" />} label="Today Views" value={stats.todayViews} accent="accent" />
              <StatCard icon={<Globe className="w-5 h-5" />} label="Unique Today" value={stats.uniqueSessions} accent="green" />
              <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Total Views" value={stats.totalViews} accent="gold" />
            </div>

            {/* Hourly Chart */}
            <div className="glass-bg rounded-xl border border-white/[0.06] p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Page Views — Last 24 Hours</h2>
              </div>
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(358, 93%, 47%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(358, 93%, 47%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" tick={{ fill: "hsl(240, 8%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(240, 8%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(240, 14%, 9%)",
                        border: "1px solid hsla(0,0%,100%,0.06)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "white",
                      }}
                    />
                    <Area type="monotone" dataKey="views" stroke="hsl(358, 93%, 47%)" fill="url(#viewsGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Top Movies */}
              <div className="glass-bg rounded-xl border border-white/[0.06] p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Film className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Most Played Movies</h2>
                </div>
                {topMovies.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No data yet</p>
                ) : (
                  <div className="h-56 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topMovies} layout="vertical">
                        <XAxis type="number" tick={{ fill: "hsl(240, 8%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="movie_title" tick={{ fill: "hsl(240, 8%, 55%)", fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(240, 14%, 9%)",
                            border: "1px solid hsla(0,0%,100%,0.06)",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "white",
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(192, 100%, 50%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Top Pages Pie */}
              <div className="glass-bg rounded-xl border border-white/[0.06] p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Page Distribution</h2>
                </div>
                {topPages.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No data yet</p>
                ) : (
                  <div className="h-56 sm:h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topPages}
                          dataKey="count"
                          nameKey="page"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ page, percent }) => `${page} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {topPages.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "hsl(240, 14%, 9%)",
                            border: "1px solid hsla(0,0%,100%,0.06)",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "white",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground py-4">
              Auto-refreshing every 15 seconds • Data updates in real-time
            </div>
          </>
        ) : activeTab === "ads" ? (
          <AdminAdManager />
        ) : (
          <AdminSiteSettings />
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, accent, pulse }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
  pulse?: boolean;
}) {
  const colorMap: Record<string, string> = {
    primary: "text-primary",
    accent: "text-blue-400",
    green: "text-emerald-400",
    gold: "text-amber-400",
  };

  return (
    <div className="glass-bg rounded-xl border border-white/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={colorMap[accent] || "text-primary"}>
          {icon}
        </div>
        {pulse && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{value.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
