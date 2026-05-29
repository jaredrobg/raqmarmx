"use client";
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

const SearchButton = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = () => {
        if (pathname === '/ProductosPage') {
            // Ya estamos aquí — forzamos un cambio de params con timestamp
            // para que useSearchParams lo detecte como cambio nuevo
            router.replace(`/ProductosPage?focus=search&t=${Date.now()}`);
        } else {
            router.push('/ProductosPage?focus=search');
        }
    };

    return (
        <button
            onClick={handleClick}
            className="search-float-button"
            aria-label="Buscar productos"
        >
            <Search size={28} color="#7a7878" strokeWidth={3} />
        </button>
    );
};

export default SearchButton;