import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

const pathways = [
  {
    title: "Agribusiness Innovation",
    description: "Smart farming for a growing world: Driving efficiency through data and automation to build a more resilient global food future.",
    image: "/agribusiness-innovation.jpg",
    bgColor: "bg-white",
    textColor: "text-ink",
  },
   {
    title: "Sustainable Farm Management",
    description: "Mastering modern agriculture: Bridging eco-friendly farming practices with strategic business growth and value chain success.",
    image: "/farm-management.jpg",
    bgColor: "bg-[#D9F99D]",
    textColor: "text-ink",
  },
  {
    title: "AI-Powered Business Automation",
    description: "Work smarter, not harder: Use AI and low-code tools to eliminate manual tasks, optimize workflows, and scale business impact.",
    image: "/ai-automation.jpg",
    bgColor: "bg-[#EDE9FE]",
    textColor: "text-ink",
  },
  
];

export default function CourseList() {
  return (
    <section id="courses" className="my-12 py-32 px-4 bg-primary"> {/* Paradise Hub Deep Green */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
          >
            Choose Your Path
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            The career growth you want, without putting your life on hold. <br className="hidden md:block" />
            Paradise Hub currently offers specialized Agribusiness and Tech courses designed for the next generation of leaders.
          </motion.p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid md:grid-cols-3 gap-12"
        >
          {pathways.map((path, index) => (
            <PathwayCard key={index} path={path} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PathwayCard({ path, index }: { path: typeof pathways[0]; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      className={cn(
        "relative rounded-[40px] md:rounded-[48px] p-6 md:p-10 flex flex-col justify-between min-h-[450px] md:min-h-[550px] overflow-hidden group border-4 border-ink shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(17,24,39,1)]",
        path.bgColor,
        path.textColor
      )}
    >
      {/* Organic Blob Image - As seen in image */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 w-32 h-32 md:w-48 md:h-48 z-10">
        <div className="relative w-full h-full">
          <img 
            src={path.image} 
            alt={path.title} 
            className="w-full h-full object-cover rounded-tr-[60px] md:rounded-tr-[100px] rounded-bl-[60px] md:rounded-bl-[100px] rounded-tl-[30px] md:rounded-tl-[50px] rounded-br-[30px] md:rounded-br-[50px] border-4 border-ink shadow-lg group-hover:rotate-3 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-32 md:mt-48 relative z-20">
        <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight leading-none">
          {path.title}
        </h3>
        <p className="text-base md:text-xl opacity-90 font-medium leading-tight mb-8 md:mb-12 max-w-[90%]">
          {path.description}
        </p>
      </div>

      {/* Arrow Button at Bottom Right */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 45 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-ink rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transition-all"
        >
          <ArrowUpRight size={24} className="text-ink md:w-8 md:h-8" />
        </motion.button>
      </div>
    </motion.div>
  );
}
