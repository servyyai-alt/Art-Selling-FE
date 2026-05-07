// // import React from 'react';
// // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { HiOutlineExternalLink, HiOutlineLogout } from 'react-icons/hi';
// // import { logout } from '../../redux/authSlice';
// // import ARTLogo from '../../assets/ARTLOGO.jpeg';

// // const adminLinks = [
// //   { label: 'Dashboard', href: '/admin' },
// //   { label: 'Products', href: '/admin/products' },
// //   { label: 'Orders', href: '/admin/orders' },
// //   { label: 'Users', href: '/admin/users' },
// // ];

// // export default function AdminLayout({ children }) {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const { user } = useSelector((s) => s.auth);

// //   const handleLogout = () => {
// //     dispatch(logout());
// //     navigate('/admin/login', { replace: true });
// //   };

// //   const isActive = (href) => {
// //     if (href === '/admin') return location.pathname === '/admin';
// //     return location.pathname.startsWith(href);
// //   };

// //   return (
// //     <>
// //       <header className="fixed top-0 left-0 right-0 z-50 bg-black text-cream border-b border-mid-gray shadow-luxury">
// //         <div className="max-w-7xl mx-auto px-6 py-4">
// //           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
// //             <div className="flex items-center gap-4">
// //         <Link to="/" className="flex-shrink-0 flex items-center">
// //   <img
// //     src={ARTLogo}
// //     alt="Logo"
// //     className="h-14 w-14 md:h-16 md:w-16 rounded-full object-contain bg-white p-1"
// //   />
// // {/* </Link> */}
// //                 <div>
// //                   <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Admin Panel</p>
// //                   <p className="font-display text-xl font-light leading-none">ARTT Console</p>
// //                 </div>
// //               </Link>
// //             </div>

// //             <div className="flex flex-col gap-3 lg:items-end">
// //               <div className="flex flex-wrap items-center gap-2">
// //                 {adminLinks.map((link) => (
// //                   <Link
// //                     key={link.href}
// //                     to={link.href}
// //                     className={`font-sans text-xs tracking-widest uppercase px-3 py-2 border transition-colors ${
// //                       isActive(link.href)
// //                         ? 'border-gold bg-gold text-black'
// //                         : 'border-mid-gray text-light-gray hover:border-gold hover:text-gold'
// //                     }`}
// //                   >
// //                     {link.label}
// //                   </Link>
// //                 ))}
// //                 <Link
// //                   to="/"
// //                   className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-3 py-2 border border-mid-gray text-light-gray hover:border-gold hover:text-gold transition-colors"
// //                 >
// //                   View Store <HiOutlineExternalLink className="w-3.5 h-3.5" />
// //                 </Link>
// //                 <button
// //                   onClick={handleLogout}
// //                   className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-3 py-2 border border-mid-gray text-light-gray hover:border-red-400 hover:text-red-300 transition-colors"
// //                 >
// //                   Logout <HiOutlineLogout className="w-3.5 h-3.5" />
// //                 </button>
// //               </div>

// //               <p className="font-sans text-xs text-light-gray">
// //                 Signed in as <span className="text-cream">{user?.name || 'Admin'}</span>
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {children}
// //     </>
// //   );
// // }

// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   HiOutlineExternalLink,
//   HiOutlineLogout,
//   HiMenuAlt3,
// } from 'react-icons/hi';

// import { logout } from '../../redux/authSlice';
// import ARTLogo from '../../assets/ARTLOGO.jpeg';

// const adminLinks = [
//   { label: 'Dashboard', href: '/admin' },
//   { label: 'Products', href: '/admin/products' },
//   { label: 'Orders', href: '/admin/orders' },
//   { label: 'Users', href: '/admin/users' },
// ];

// export default function AdminLayout({ children }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((s) => s.auth);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/admin/login', { replace: true });
//   };

//   const isActive = (href) => {
//     if (href === '/admin') {
//       return location.pathname === '/admin';
//     }

//     return location.pathname.startsWith(href);
//   };

//   return (
//     <div className="min-h-screen bg-[#faf8f5]">
//       {/* HEADER */}
//       <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur-xl shadow-sm">
//         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="min-h-[84px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 py-4">
//             {/* LEFT */}
//             <div className="flex items-center justify-between gap-4">
//               <Link
//                 to="/admin"
//                 className="flex items-center gap-4 group"
//               >
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                   <img
//                     src={ARTLogo}
//                     alt="ARTT Logo"
//                     className="relative h-14 w-14 md:h-16 md:w-16 rounded-2xl object-cover border border-black/10 shadow-md bg-white p-1 transition-transform duration-300 group-hover:scale-105"
//                   />
//                 </div>

//                 <div>
//                   <p className="font-sans text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-gold font-medium mb-1">
//                     Admin Panel
//                   </p>

//                   <h1 className="font-display text-xl md:text-2xl text-black font-light leading-none">
//                     ARTT Console
//                   </h1>
//                 </div>
//               </Link>

//               {/* MOBILE ICON */}
//               <button className="lg:hidden w-11 h-11 rounded-xl border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300">
//                 <HiMenuAlt3 className="w-5 h-5" />
//               </button>
//             </div>

//             {/* RIGHT */}
//             <div className="flex flex-col gap-4">
//               {/* NAVIGATION */}
//               <div className="flex flex-wrap items-center gap-3 lg:justify-end">
//                 {adminLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     to={link.href}
//                     className={`relative overflow-hidden px-4 py-2.5 rounded-xl border text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
//                       isActive(link.href)
//                         ? 'bg-black text-white border-black shadow-lg'
//                         : 'bg-white text-black border-black/10 hover:border-black hover:-translate-y-0.5 hover:shadow-md'
//                     }`}
//                   >
//                     {link.label}
//                   </Link>
//                 ))}

//                 {/* VIEW STORE */}
//                 <Link
//                   to="/"
//                   className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 bg-white text-black text-xs tracking-[0.2em] uppercase font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-300 hover:-translate-y-0.5"
//                 >
//                   View Store
//                   <HiOutlineExternalLink className="w-4 h-4" />
//                 </Link>

//                 {/* LOGOUT */}
//                 <button
//                   onClick={handleLogout}
//                   className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs tracking-[0.2em] uppercase font-medium hover:bg-red-500 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
//                 >
//                   Logout
//                   <HiOutlineLogout className="w-4 h-4" />
//                 </button>
//               </div>

//               {/* USER INFO */}
//               <div className="flex items-center justify-end">
//                 <div className="bg-black text-white px-4 py-2 rounded-2xl shadow-sm">
//                   <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/60 mb-1">
//                     Signed In
//                   </p>

//                   <p className="font-medium text-sm">
//                     {user?.name || 'Admin'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* PAGE CONTENT */}
//       <main className="pt-[120px] pb-10 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-[1600px] mx-auto">
//           <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-180px)]">
//             {children}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }