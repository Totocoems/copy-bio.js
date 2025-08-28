/**
 * @name CopyBio
 * @version 1.0.0
 * @description Adds "Copy Bio" to user context menu so you can copy their bio text
 * @author Kalage
 */

export default class CopyBio {
    start() {
        this.patchMenu();
    }

    stop() {
        BdApi.Patcher.unpatchAll("CopyBio");
    }

    patchMenu() {
        const UserContextMenu = BdApi.Webpack.findModule(m => m?.default?.displayName === "UserContextMenu");

        BdApi.Patcher.after("CopyBio", UserContextMenu, "default", (_, [props], ret) => {
            const user = props.user;
            if (!user) return;

            const bio = user?.bio || user?.profile?.bio || "No bio set";

            const newItem = BdApi.ContextMenu.buildItem({
                label: "Copy Bio",
                id: "copy-bio",
                action: () => {
                    BdApi.nativeClipboard.copy(bio);
                    BdApi.showToast("Copied bio!", { type: "success" });
                }
            });

            const group = BdApi.Utils.findInReactTree(ret, n => Array.isArray(n?.props?.children));
            if (group) group.props.children.push(newItem);
        });
    }
}
