export default function Footer() {
    return (
        <footer className="bg-cover bg-center" style={{ backgroundImage: "url('/images/footerbackgraund.png')" }}>
            <div className="bg-black bg-opacity-50">
                <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-white">
                    <div className="flex flex-wrap justify-between">
                        {/* Contacto */}
                        <div className="w-full sm:w-1/3 mb-6">
                            <h4 className="text-xl font-bold mb-4">Contacto</h4>
                            <p>Ecuador</p>
                            <p>Dirección: Marcelino Champagnat s/n</p>
                            <p>Teléfono: +593 3701444</p>
                        </div>

                        {/* Menú Inicio */}
                        <div className="w-full sm:w-1/3 mb-6">
                            <h4 className="text-xl font-bold mb-4">Menú Inicio</h4>
                            <ul className="space-y-2">
                                <li><a href="/bienvenida" className="hover:underline">Bienvenida</a></li>
                                <li><a href="/laboratorio" className="hover:underline">Laboratorio</a></li>
                                <li><a href="/blog-tecnico" className="hover:underline">Blog Técnico</a></li>
                                <li><a href="/equipo" className="hover:underline">Equipo</a></li>
                                <li><a href="/recursos-academicos" className="hover:underline">Recursos Académicos</a></li>
                                <li><a href="/investigacion" className="hover:underline">Investigación</a></li>
                            </ul>
                        </div>

                        {/* Redes Sociales */}
                        <div className="w-full sm:w-1/3 mb-6">
                            <h4 className="text-xl font-bold mb-4">Redes Sociales</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-white">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Legal Links and Copyright */}
                    <div className="mt-8 border-t border-gray-700 pt-6 flex justify-between">
                        <p className="text-gray-300">
                            <a href="#" className="hover:underline">Declaración de Privacidad</a> |
                            <a href="#" className="hover:underline"> Términos de Uso</a>
                        </p>
                        <p className="text-gray-300">Copyright 2024 Laboratorio Virtual Hidrología (hydrovlab)</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
