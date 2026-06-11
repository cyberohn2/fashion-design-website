// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import { createClient } from "./lib/supabase/server";

// export async function proxy(request: NextRequest) {
//   let response = NextResponse.next({
//     request,
//   });

//   const supabase = await createClient(request);

//   await supabase.auth.getUser();

//   return response;
// }

// export const config = {
//   matcher: ["/about/:path*", "/dashboard/:path*"],
// };