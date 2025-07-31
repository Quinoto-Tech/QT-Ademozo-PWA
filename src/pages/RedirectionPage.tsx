import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseCarrouselController } from "../lib/js/carrousel/controllers/index.ts";
import { BaseSelectorController } from "../lib/js/selector/controllers/index.ts";
import { Restaurant, restaurants } from '../lib/js/mock-data.ts';
import './redirection-page.css';


export function RedirectionPage() {

    useEffect(() => {
        // Begin - Carrousels //
        const elCardenal = document.getElementById("el-cardenal_carrousel");
        const corazonDeMaguey = document.getElementById("corazon-de-maguey_carrousel");

        if (elCardenal) new BaseCarrouselController(elCardenal);
        if (corazonDeMaguey) new BaseCarrouselController(corazonDeMaguey);
        // End - Carrousels //
    }, []);

    useEffect(() => {
        // Begin - Selectors //
        const comandaYaMenu = document.getElementById("comandaya_menu");
        if (comandaYaMenu) new BaseSelectorController(comandaYaMenu);
        // End - Selectors //
    }, []);

    const navigate = useNavigate();

    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiQWxhbiIsImxhc3RfbmFtZSI6Ik1vbnRlcyBkZSBvY2EgQ2FzdHJvIiwiY3VycCI6Ik1PQ0E5MjA3MDNITUNOU0wwNSIsImVtYWlsIjoiYWRlb2NhMTEyMDEwQGdtYWlsLmNvbSIsImNvbXBhbnkiOiJDT05UQUNUTyBHQVJBTlRJRE8iLCJtYXhfY3JlZGl0X2xpbmUiOjUyMjkuMDEsInJlbWFpbmluZ19jcmVkaXRfbGluZSI6MCwicGxhdGZvcm0iOiJhZGVjYXNoIiwiYWRlbW96b190ZW5hbnRfbmFtZSI6IkJhciIsImFkZW1vem9fdGVuYW50IjoiOTVhOTc5NDYtNGMxYy00NzU5LWExZmItZjJhNzUyMjRhZjFkIiwiaWF0IjoxNzUzODUyNDQ1LjQ4NjUyNH0.i7njSAq_xTOxCwi3EMWeIgEBsAuHvgGFe0PCFhDw4EI";
    const goToIndex = () => {
        navigate(`/${TOKEN}`);
    };

    const restaurant_list: Restaurant[]  = restaurants

    return (
      <div className="flex h-screen overflow-hidden">

        <main className="flex-1 flex flex-col size-full bg-primary-50">
            {/* Begin - Navbar/Appbar */}
            <nav className="z-20 flex items-center justify-between size-full max-h-24 p-4 
                shadow-lg shadow-primary-700/30"
            >
                <div className="flex items-center justify-between gap-2">
                    <img src="/images/comandaya.png" alt="comandaya-logo" 
                        className="size-full max-w-24"
                    />
                </div>
                <div id="comandaya_menu" className="relative inline-block">
                    <button id="comandaya_menu_button" className="flex items-center justify-between gap-x-2 w-full 
                        px-4 py-2 text-left text-lg outline-none cursor-pointer transition-all duration-300 
                        ease-in-out bg-secondary-500 text-white rounded-md shadow-md shadow-secondary-500/50 
                        hover:bg-secondary-500/80 hover:shadow-lg hover:shadow-secondary-500/50"
                    >
                        <span className="font-semibold">Menu</span>
                    </button>

                    <div id="comandaya_menu_dropdown" className="absolute right-0 z-10 my-2 rounded-md 
                        shadow-lg transform transition-all duration-300 ease-in-out scale-95 opacity-0 
                        overflow-hidden pointer-events-none min-w-72 bg-white text-primary-700"
                    >
                        <ul>
                            <li>
                                <a href="#" onClick={(e) => e.preventDefault()} 
                                className="flex items-center justify-between gap-x-3 w-full px-4 py-3 
                                    hover:bg-gray-200/70"
                                >
                                    Filtrar Restaurantes
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => e.preventDefault()} 
                                    className="flex items-center justify-between gap-x-3 w-full px-4 py-3 
                                    bg-primary-700 text-white hover:bg-primary-700/70"
                                >
                                    <img src="/images/adecash-logo.svg" alt="adecash-logo" className="size-7" />
                                    Volver a Adecash
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* End - Navbar/Appbar */}

            {/* Begin - Content */}
            <section className="flex flex-col size-full gap-y-6 p-6 font-sans overflow-y-auto scrollbar-beautify">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-6">
                    {restaurant_list.map((r) => (
                        <article key={r.slug} className="size-full bg-white">
                            <div className="flex flex-col size-full rounded-lg shadow-lg overflow-hidden">
                                {/* Replace the following with your actual carousel and content */}
                                <div className="overflow-hidden">
                                    <div id={`${r.slug}_carrousel`} className="relative flex-1 size-full overflow-hidden">
                                        {/* Slides */}
                                        <div id={`${r.slug}_carrousel_track`} className="flex transition-transform duration-700 ease-in-out">
                                            {r.images && r.images.map((image: any, idx: number) => (
                                                <div key={idx} className="w-full flex-shrink-0">
                                                    <img src={image.url} alt={image.name} className="w-full h-64 object-cover object-center" />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Prev/Next Buttons */}
                                        <button id={`${r.slug}_carrousel_previous_button`} 
                                            className="z-10 absolute top-1/2 left-2 md:left-4 flex items-center justify-center transform -translate-y-1/2 bg-white/50 hover:bg-white size-10 rounded-full opacity-0 transition-all duration-300 ease-in-out"
                                        >&lt;</button>
                                        <button id={`${r.slug}_carrousel_next_button`} 
                                            className="z-10 absolute top-1/2 right-2 md:right-4 flex items-center justify-center transform -translate-y-1/2 bg-white/50 hover:bg-white size-10 rounded-full opacity-100 transition-all duration-300 ease-in-out"
                                        >&gt;</button>
                                        {/* Indicators */}
                                        <div id={`${r.slug}_carrousel_indicators`} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-x-2">
                                            {r.images && r.images.map((_: any, idx: number) => (
                                                <button key={idx} className={`size-4 rounded-full ${idx === 0 ? 'bg-white/70' : 'bg-white/40'}`}></button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <form className="flex flex-col justify-between gap-y-4 p-6">
                                    <h2 className="text-lg md:text-xl text-primary-700 font-semibold">{r.name}</h2>
                                    <button onClick={goToIndex} type="button" 
                                        className="self-end px-4 py-2 bg-secondary-500 text-white rounded-md shadow-md shadow-secondary-500/50 hover:bg-secondary-500/80 hover:shadow-lg hover:shadow-secondary-500/50 transition-all duration-300 ease-in-out"
                                    >Ordenar Comida</button>
                                </form>
                            </div>
                        </article>
                    )) }
                </div>
            </section>
            {/* End - Content */}
        </main>

      </div>
    );

}
