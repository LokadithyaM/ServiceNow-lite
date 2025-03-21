export default function Home() {
  return (
      <div className="flex bg-black flex-col border-black justify-center gap-6 min-h-screen w-full p-6">
          {/* Hero Section */}
          <div className="h-[900px] flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-[80px] font-black bg-gradient-to-r from-gray-800 via-green-400 to-green-500 text-transparent bg-clip-text leading-tight">
                  Your Space to Build <br /> The Future
              </h1>
              <p className="text-xl text-gray-300 mt-4 max-w-2xl">
                  "Alone, you move fast. Together, you go far—and build something that lasts."
              </p>
          </div>

          {/* Features Section */}
          <div className="flex flex-col gap-6 w-full p-8">
              <div className="grid grid-cols-2 gap-6">
                  <FeatureCard 
                      title="A Ticketing System" 
                      text="Streamline task tracking and issue resolution with a structured system—built for small teams, startups, and creative minds." 
                  />
                  <FeatureCard 
                      title="Bridging ITSM & Collaboration" 
                      text="A seamless fusion of structured ticketing with real-time updates, ensuring smooth team communication and task tracking." 
                  />
              </div>

              <div className="grid grid-cols-3 gap-6">
                  <FeatureCard 
                      title="Scalable & Lightweight" 
                      text="Designed for agility—optimized for small teams and fast-moving projects without unnecessary complexity." 
                  />
                  <FeatureCard 
                      title="Integration Ready" 
                      text="Easily connects with your existing workflow, personal pages, and project management tools for a smooth experience." 
                  />
                  <FeatureCard 
                      title="Custom Documentation" 
                      text="Built-in knowledge management keeps project notes and essential documentation all in one place, minimizing external dependencies." 
                  />
              </div>
          </div>

          {/* User Flow Section */}
          <div className="flex h-[800px] gap-6 items-center w-full p-[50px]">
              <UserFlowCard 
                  title="Admin Panel →" 
                  text="Are you an admin looking to set up your team and kickstart the next big project? This way →"
                  link="/signup"
              />
              <UserFlowCard 
                  title="Start Onboarding →" 
                  text="New here? Welcome aboard! Let's get you started on your journey with a smooth onboarding process."
                  link="/UserSignup"
              />
              <UserFlowCard 
                  title="Go to Dashboard →" 
                  text="Already familiar with the system? Jump straight to your workspace and get back to work."
                  link="/"
              />
          </div>
      </div>
  );
}

interface FeatureCardProps {
  title: string;
  text: string;
}

function FeatureCard({ title, text }: FeatureCardProps) {
  return (
      <div className="p-6 h-full text-white text-center bg-[#151515] shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{text}</p>
      </div>
  );
}

interface UserFlowCardProps {
  title: string;
  text: string;
  link: string;
}

function UserFlowCard({ title, text, link }: UserFlowCardProps) {
  return (
      <div className="flex flex-col justify-between h-1/2 w-1/3 p-6 bg-[#151515] rounded-xl shadow-lg relative text-white">
          <p className="text-lg text-gray-300 leading-relaxed">{text}</p>
          <a href={link} className="absolute bottom-4 right-4">
              <button className="px-6 py-3 text-lg font-bold bg-green-900 cursor-pointer text-white rounded-lg shadow-md transition hover:scale-105 hover:bg-green-600">
                  {title}
              </button>
          </a>
      </div>
  );
}
