import { Outlet } from 'react-router-dom';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { ParticleBackground } from '@shared/components/effects/ParticleBackground';
import { ChatBadge, ChatWindow } from '@features/chat';
import useAuthStore from '@app/store/authStore';

/**
 * MainLayout — Layout cho trang public (Landing, Login, Register, Jobs)
 */
export default function MainLayout() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <div className="relative min-h-screen font-body overflow-x-hidden">
      {/* Background Particles layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <ParticleBackground showRings={true} />
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center w-full relative pt-16 pb-8">
        <Outlet />
      </main>

      <Footer />

      {isAuthenticated && (
        <>
          <ChatBadge />
          <ChatWindow />
        </>
      )}
    </div>
  );
}
