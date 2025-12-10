# 📊 Ranking de Archivos más Largos

Este documento lista los 50 archivos con mayor número de líneas de código en el proyecto `rechordb`.
(Excluyendo `vendor`, `node_modules`, `uploads` y `.git`).

La modularización es clave para la mantenibilidad. El objetivo es mantener los archivos de lógica por debajo de las 200-250 líneas.

| # | Líneas | Archivo | Tipo |
|---|-------:|:--------|:-----|
| 1 | 739 | `rechord.sql` | SQL |
| 2 | 367 | `frontend\logic\adminHomeLogic.js` | JS (Logic) |
| 3 | 286 | `frontend\services\cancionService.js` | JS (Service) |
| 4 | 281 | `frontend\pages\synchronizer\events.js` | JS (Logic) |
| 5 | 278 | `frontend\components\layout\FolderSidebar.js` | JS (Component) |
| 6 | 272 | `frontend\pages\PlayerPage.js` | JS (Page) |
| 7 | 264 | `frontend\components\logic\EditSongLogic.js` | JS (Logic) |
| 8 | 244 | `frontend\styles\EditorPage.css` | CSS |
| 9 | 236 | `frontend\pages\Messages.js` | JS (Page) |
| 10 | 226 | `frontend\pages\synchronizer\rendering.js` | JS (Logic) |
| 11 | 220 | `frontend\pages\Sincronizador.js` | JS (Page) |
| 12 | 211 | `frontend\components\player\PlayerControls.js` | JS (Component) |
| 13 | 204 | `backend\services\CancionManager.php` | PHP (Service) |
| 14 | 203 | `frontend\components\admin\AdminHeroTab.js` | JS (Component) |
| 15 | 199 | `backend\controllers\UsuarioController.php` | PHP (Controller) |
| 16 | 196 | `frontend\components\layout\Header.js` | JS (Component) |
| 17 | 195 | `backend\models\Chat.php` | PHP (Model) |
| 18 | 190 | `frontend\test_db.html` | HTML |
| 19 | 179 | `backend\controllers\AcordeSincronizadoController.php` | PHP (Controller) |
| 20 | 167 | `frontend\styles.css` | CSS |
| 21 | 165 | `frontend\styles\PlayerPage.css` | CSS |
| 22 | 164 | `frontend\styles\components\PlayerControls.css` | CSS |
| 23 | 158 | `frontend\components\player\Player_deprecated.js` | JS (Legacy) |
| 24 | 151 | `frontend\components\admin\HomeConfigList.js` | JS (Component) |
| 25 | 150 | `frontend\components\admin\AdminUsersTab.js` | JS (Component) |
| 26 | 149 | `frontend\core\Router.js` | JS (Core) |
| 27 | 147 | `backend\models\Cancion.php` | PHP (Model) |
| 28 | 144 | `frontend\services\authService.js` | JS (Service) |
| 29 | 142 | `frontend\pages\ComponentShowcase.js` | JS (Page) |
| 30 | 141 | `frontend\pages\User.js` | JS (Page) |
| 31 | 130 | `backend\controllers\CancionController.php` | PHP (Controller) |
| 32 | 128 : `frontend\styles\components\RegisterForm.css` | CSS |
| 33 | 128 : `frontend\pages\Profile.js` | JS (Page) |
| 34 | 128 : `frontend\styles\components\LoginForm.css` | CSS |
| 35 | 124 : `frontend\components\layout\SessionSidebar.js` | JS (Component) |
| 36 | 119 : `frontend\styles\components\SongCard.css` | CSS |
| 37 | 116 : `frontend\services\socketService.js` | JS (Service) |
| 38 | 115 : `frontend\pages\AdminDashboard.js` | JS (Page) |
| 39 | 106 : `frontend\components\layout\SidebarContainer.js` | JS (Component) |
| 40 | 102 : `frontend\components\home\HeroCarousel.js` | JS (Component) |
| 41 | 102 : `frontend\services\acordeSincronizadoService.js` | JS (Service) |
| 42 | 101 : `backend\controllers\HeroController.php` | PHP (Controller) |
| 43 | 99 : `backend\api\admin_websocket.php` | PHP (API) |
| 44 | 97 : `frontend\components\modals\EditSongModal.js` | JS (Component) |
| 45 | 92 : `frontend\components\logic\NewSongLogic.js` | JS (Logic) |
| 46 | 92 : `frontend\components\admin\AdminWebSocketTab.js` | JS (Component) |
| 47 | 91 : `frontend\core\StateStore.js` | JS (Core) |
| 48 | 86 : `frontend\components\editor\EditorLyrics.js` | JS (Component) |
| 49 | 86 : `frontend\services\chatService.js` | JS (Service) |
| 50 | 85 : `backend\controllers\ChatController.php` | PHP (Controller) |

---
**Nota:** `HomePage.js` ha sido refactorizado y reducido significativamente (~70 líneas).
