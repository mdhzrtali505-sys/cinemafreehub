import { supabase } from "@/integrations/supabase/client";

function getSessionId(): string {
  let sid = sessionStorage.getItem("pf_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("pf_session_id", sid);
  }
  return sid;
}

export async function trackPageView(page: string) {
  const sessionId = getSessionId();
  await supabase.from("page_views").insert({
    page,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    session_id: sessionId,
  });
}

export async function trackMovieClick(movieId: number, movieTitle: string, action = "play") {
  const sessionId = getSessionId();
  await supabase.from("movie_clicks").insert({
    movie_id: movieId,
    movie_title: movieTitle,
    action,
    session_id: sessionId,
  });
}

export async function heartbeat(currentPage: string) {
  const sessionId = getSessionId();
  await supabase.from("active_sessions").upsert(
    { session_id: sessionId, last_seen: new Date().toISOString(), current_page: currentPage },
    { onConflict: "session_id" }
  );
}

let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

export function startHeartbeat(page: string) {
  heartbeat(page);
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => heartbeat(page), 30000);
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
