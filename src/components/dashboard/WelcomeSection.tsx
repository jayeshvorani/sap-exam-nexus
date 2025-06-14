
import { User } from "@supabase/supabase-js";

interface WelcomeSectionProps {
  user: User;
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-light text-gray-900 mb-2">
        Welcome back, {user?.user_metadata?.full_name || user?.email}
      </h2>
      <p className="text-gray-600">Ready to continue your SAP certification journey?</p>
    </div>
  );
};

export default WelcomeSection;
