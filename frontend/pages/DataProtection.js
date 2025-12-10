export function DataProtection() {
    return `
        <div class="min-h-screen bg-black text-white p-8">
            <div class="max-w-4xl mx-auto space-y-8">
                <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                    Protección de Datos
                </h1>
                
                <section class="space-y-4">
                    <p class="text-gray-300">
                        Información detallada sobre la protección de datos en ReChord y sus derechos como usuario.
                    </p>
                </section>

                <section class="space-y-4">
                    <h2 class="text-2xl font-semibold text-white">Sus Derechos (RGPD)</h2>
                    <p class="text-gray-400">
                        De acuerdo con el Reglamento General de Protección de Datos (RGPD), usted tiene los siguientes derechos:
                    </p>
                    <ul class="list-disc list-inside text-gray-400 space-y-2 ml-4">
                        <li>Derecho de acceso a sus datos personales.</li>
                        <li>Derecho de rectificación de datos inexactos.</li>
                        <li>Derecho de supresión ("derecho al olvido").</li>
                        <li>Derecho a la limitación del tratamiento.</li>
                        <li>Derecho a la portabilidad de los datos.</li>
                        <li>Derecho de oposición.</li>
                    </ul>
                </section>

                <section class="space-y-4">
                    <h2 class="text-2xl font-semibold text-white">Responsable del Tratamiento</h2>
                    <p class="text-gray-400">
                        El responsable del tratamiento de sus datos es ReChord. Para ejercer sus derechos o para cualquier consulta sobre protección de datos, puede contactarnos a través de nuestro soporte.
                    </p>
                </section>

                <div class="pt-8 border-t border-gray-800">
                    <a href="#/" class="text-indigo-400 hover:text-indigo-300 transition-colors">
                        &larr; Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    `;
}
