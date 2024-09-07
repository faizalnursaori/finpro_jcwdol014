'use client';
import ProfileCard from '@/components/ProfileCard';
import WithAuth from '@/components/WithAuth';

 function Profile() {

  return (
    <div className="flex justify-center gap-6">
      <ProfileCard />
    </div>
  );
}

export default WithAuth(Profile)
