[ Volver al �ndice](index.md)

# 📊 Ranking de Archivos más Largos

Este documento lista los 50 archivos con mayor número de líneas de código en el proyecto `rechordb`.
(Excluyendo `vendor`, `node_modules`, `uploads` y `.git`).

La modularización ha sido muy efectiva. Los archivos monolíticos han desaparecido o reducido su tamaño drásticamente.

| # | Líneas | Archivo | Tipo |
|---|-------:|:--------|:-----|
| 1 | 739 | `rechord.sql` | SQL |
| 2 | 285 | `frontend\components\synchronizer\events.js` | JS (Logic) |
| 3 | 278 | `frontend\components\layout\FolderSidebar.js` | JS (Component) |
| 4 | 264 | `frontend\components\logic\EditSongLogic.js` | JS (Logic) |
| 5 | 244 | `frontend\styles\EditorPage.css` | CSS |
| 6 | 226 | `frontend\components\synchronizer\rendering.js` | JS (Logic) |
| 7 | 211 | `frontend\components\player\PlayerControls.js` | JS (Component) |
| 8 | 204 | `backend\services\CancionManager.php` | PHP (Service) |
| 9 | 203 | `frontend\components\admin\AdminHeroTab.js` | JS (Component) |
| 10 | 199 | `backend\controllers\UsuarioController.php` | PHP (Controller) |
| 11 | 196 | `frontend\components\layout\Header.js` | JS (Component) |
| 12 | 195 | `backend\models\Chat.php` | PHP (Model) |
| 13 | 190 | `frontend\test_db.html` | HTML |
| 14 | 179 | `backend\controllers\AcordeSincronizadoController.php` | PHP (Controller) |
| 15 | 167 | `frontend\styles.css` | CSS |
| 16 | 165 | `frontend\styles\PlayerPage.css` | CSS |
| 17 | 164 | `frontend\styles\components\PlayerControls.css` | CSS |
| 18 | 158 | `frontend\components\player\Player_deprecated.js` | JS (Legacy) |
| 19 | 151 | `frontend\components\admin\HomeConfigList.js` | JS (Component) |
| 20 | 150 | `frontend\components\admin\AdminUsersTab.js` | JS (Component) |
| 21 | 148 | `frontend\core\Router.js` | JS (Core) |
| 22 | 147 | `backend\models\Cancion.php` | PHP (Model) |
| 23 | 144 | `frontend\services\authService.js` | JS (Service) |
| 24 | 142 | `frontend\pages\ComponentShowcase.js` | JS (Page) |
| 25 | 137 | `frontend\services\cancionService.js` | JS (Service) |
| 26 | 133 | `frontend\components\player\PlayerController.js` | JS (Controller) |
| 27 | 130 | `backend\controllers\CancionController.php` | PHP (Controller) |
| 28 | 128 | `frontend\styles\components\LoginForm.css` | CSS |
| 29 | 128 | `frontend\styles\components\RegisterForm.css` | CSS |
| 30 | 128 | `frontend\pages\Profile.js` | JS (Page) |
| 31 | 124 | `frontend\components\layout\SessionSidebar.js` | JS (Component) |
| 32 | 121 | `frontend\pages\User.js` | JS (Page) |
| 33 | 119 | `frontend\components\messages\ChatController.js` | JS (Controller) |
| 34 | 119 | `frontend\services\homeAdminService.js` | JS (Service) |
| 35 | 119 | `frontend\styles\components\SongCard.css` | CSS |
| 36 | 116 | `frontend\services\socketService.js` | JS (Service) |
| 37 | 114 | `frontend\logic\adminHomeConfig.js` | JS (Logic) |
| 38 | 106 | `frontend\components\layout\SidebarContainer.js` | JS (Component) |
| 39 | 102 | `frontend\components\home\HeroCarousel.js` | JS (Component) |
| 40 | 102 | `frontend\services\acordeSincronizadoService.js` | JS (Service) |
| 41 | 101 | `backend\controllers\HeroController.php` | PHP (Controller) |
| 42 | 99 | `backend\api\admin_websocket.php` | PHP (API) |
| 43 | 99 | `frontend\pages\Sincronizador.js` | JS (Page) |
| 44 | 97 | `frontend\components\modals\EditSongModal.js` | JS (Component) |
| 45 | 93 | `frontend\components\synchronizer\SyncController.js` | JS (Controller) |
| 46 | 92 | `frontend\components\logic\NewSongLogic.js` | JS (Logic) |
| 47 | 92 | `frontend\components\admin\AdminWebSocketTab.js` | JS (Component) |
| 48 | 91 | `frontend\core\StateStore.js` | JS (Core) |
| 49 | 86 | `frontend\services\chatService.js` | JS (Service) |
| 50 | 86 | `frontend\components\editor\EditorLyrics.js` | JS (Component) |

---
**Notas de Progreso:**
- **adminHomeLogic.js** (antes 367 líneas) ha desaparecido, reemplazado por modulos más pequeños (`adminHomeConfig.js` con 114 líneas).
- **cancionService.js** se redujo de 286 a 137 líneas.
- Ahora los archivos más grandes son `events.js` (lógica del editor) y `FolderSidebar.js`.

