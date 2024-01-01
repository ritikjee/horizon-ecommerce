import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useAuth = () => {
  const router = useRouter();
  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      toast.success("Logout successful");
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      toast.error("Could not logout. Please try again.");
    }
  };

  return { signOut };
};

export default useAuth;
