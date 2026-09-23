import { cocina } from './cocina.js';

// ==========================================
// PRUEBAS EN TERMINAL (FORMATO TABLA)
// en la tm cd version0.1 despues node prueba.js
// ==========================================

console.log("\n=== 1. PRODUCTOS BARATOS (<= $80) ===");
console.table(cocina.obtenerProductosBaratos(80));

console.log("\n=== 2. PRODUCTOS CAROS (> $80) ===");
console.table(cocina.obtenerProductosCaros(80));

console.log("\n=== 3. BUSCAR POR PALABRA 'cafe' ===");
console.table(cocina.buscarPorPalabraClave("cafe"));

console.log("\n=== 4. BUSCAR POR PALABRA 'cheesecake' ===");
console.table(cocina.buscarPorPalabraClave("cheesecake"));