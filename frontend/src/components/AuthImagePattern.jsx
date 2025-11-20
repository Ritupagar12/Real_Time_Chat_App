// import { __DO_NOT_USE__ActionTypes } from "@reduxjs/toolkit";

// const AuthImagePattern = ({ title, subtitle }) => {

//   return <>
//     <div className="hidden lg:flex items-center justify-center p-12">
//       <div className="max-w-md text-center">
//         {/* Grid pattern */}
//         <div className="grid grid-cols-3 gap-3 mb-8">
//           {
//             [...Array(9)].map((_, i) => {
//               return (
//               <div
//                 key={i}
//                 className={`aspect-square rounded-2xl bg-gray-700/30 ${i % 2 === 0 ? "animate-pulse" : ""
//                   }`}
//                   />
//               );
//             })
//           }
//         </div>
//         <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
//         <p className="text-gray-700">{subtitle}</p>
//       </div>
//     </div>
//   </>;
// };

// export default AuthImagePattern;
const AuthImagePattern = ({ title, subtitle }) => {
  const bubbles = Array(12).fill(null);

  return (
    <div className="hidden lg:flex items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Floating chat bubbles */}
      {bubbles.map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-200/50"
          style={{
            width: `${30 + Math.random() * 80}px`,
            height: `${30 + Math.random() * 80}px`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Centered Text */}
      <div className="relative max-w-md text-center z-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;