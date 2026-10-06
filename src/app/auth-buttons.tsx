import { signIn, signOut } from "@/auth"; 
 
type AuthButtonsProps = { 
  isLoggedIn: boolean; 
  userName?: string | null; 
}; 
 
export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) { 
  if (isLoggedIn) { 
    return ( 
      <div className="auth-controls"> 
        <span className="auth-user">{userName ?? "ผู้ใช้งาน"}</span> 
        <form 
          action={async () => { 
            "use server"; 
            await signOut({ redirectTo: "/" }); 
          }} 
        > 
          <button className="auth-logout-button" type="submit">ออกจากระบบ</button> 
        </form> 
      </div> 
    ); 
  } 
 
  return ( 
    <form 
      action={async () => { 
        "use server"; 
        // เติม: ชื่อ provider ของ Google (ตัวพิมพ์เล็ก) 
        await signIn("google", { redirectTo: "/" }); 
      }} 
    > 
      <button className="auth-login-button" type="submit">
        <span aria-hidden="true">🔒</span>
        เข้าสู่ระบบด้วย Google
      </button> 
    </form> 
  ); 
} 
