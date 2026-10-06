import ProductExplorer from "@/components/ProductExplorer";
import { auth } from "@/auth";
import { AuthButtons } from "./auth-buttons";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <>
      <div className="auth-bar app-shell">
        {/* OAuth: แสดงปุ่ม Login/Logout ตาม session*/}
        <AuthButtons isLoggedIn={isLoggedIn} userName={session?.user?.name} />
      </div>
      <ProductExplorer canManage={isLoggedIn} />
    </>
  );
}
