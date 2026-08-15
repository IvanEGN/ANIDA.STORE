"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  ShoppingBag, 
  ArrowLeft,
  Sliders 
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inventario & Productos", href: "/admin/inventory", icon: Package },
    { name: "Banners & CMS", href: "/admin/banners", icon: ImageIcon },
    { name: "Gestión de Pedidos", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 bg-charcoal-950 text-white min-h-[calc(100vh-64px)] p-6 flex flex-col justify-between border-r border-charcoal-800">
      <div className="space-y-8">
        <div>
          <span className="text-[10px] font-semibold tracking-widest text-pastel-sand uppercase">
            Panel de Control
          </span>
          <h2 className="text-lg font-light tracking-[0.2em] uppercase mt-0.5">
            ANIDA <span className="text-charcoal-400 text-xs">CMS</span>
          </h2>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase transition-colors ${
                  isActive
                    ? "bg-charcoal-800 text-white font-medium border-l-2 border-pastel-sand"
                    : "text-charcoal-400 hover:text-white hover:bg-charcoal-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-charcoal-800 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs tracking-wider uppercase text-charcoal-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la Tienda</span>
        </Link>
      </div>
    </aside>
  );
};
