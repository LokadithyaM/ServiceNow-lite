import Image from "next/image"
interface GroupProps {
    name: string;
  }
export default function Group({name}: GroupProps) {
    return (
        <div className="border-2 w-full flex items-center h-[50px]">
        <div className="border-2 h-[40px] w-[40px] m-2 rounded-full relative overflow-hidden cursor-pointer">
          <Image className="dark:invert object-cover" src="/teams.svg" alt="Logo" fill />
        </div>
            {name}
        </div>
     );
}

  