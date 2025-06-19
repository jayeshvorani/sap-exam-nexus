
import { User } from "@supabase/supabase-js";

interface WelcomeSectionProps {
  user: User;
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => {
  return (
    <div className="content-spacing">
      <h2 className="text-headline gradient-text mb-3">
        Welcome back, {user?.user_metadata?.full_name || user?.email}
      </h2>
      <p className="text-body">Ready to continue your certification journey?</p>
    </div>
  );
};

export default WelcomeSection;
