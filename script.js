
const SUPABASE_URL =
    "https://minorohtjrqsjgpvrarj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Ob0a5g0vMTgawdFvrWnAHw_eaycrm5i";

let supabaseClient = null;
const needsSupabase = Boolean(
    document.getElementById("activityReports") ||
    document.getElementById("welcomePosts")
);

if (window.supabase) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

} else if (needsSupabase) {

    console.error(
        "Supabaseを使うページでライブラリが読み込まれていません。"
    );

}


async function isSiteAdmin() {
    if (!supabaseClient) return false;
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session) return false;
    const { data, error } = await supabaseClient
        .from("site_admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
    if (error) throw error;
    return Boolean(data);
}

async function signInSiteAdmin(email, password) {
    if (!supabaseClient) throw new Error("Supabaseに接続できません。");
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    try {
        if (await isSiteAdmin()) return true;
    } catch (error) {
        await supabaseClient.auth.signOut();
        throw error;
    }
    await supabaseClient.auth.signOut();
    throw new Error("このアカウントには管理権限がありません。");
}

async function signOutSiteAdmin() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}



const menuButton =
    document.getElementById("menuButton");

const menu =
    document.getElementById("menu");


if (menuButton && menu) {

    menuButton.setAttribute(
        "aria-controls",
        "menu"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    menuButton.setAttribute(
        "aria-label",
        "メニューを開く"
    );


    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                menu.classList.toggle("open");


            menuButton.textContent =
                isOpen ? "×" : "☰";


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "メニューを閉じる"
                    : "メニューを開く"
            );

        }
    );

}



document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            !event.altKey &&
            !event.shiftKey &&
            typeof event.key === "string" &&
            event.key.toLowerCase() === "w"
        ) {
            event.preventDefault();
            event.stopPropagation();

            window.location.href =
                "index.html";

        }

    },
    { capture: true }
);



const timelineItems =
    document.querySelectorAll(
        ".timeline-item"
    );


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "show"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


timelineItems.forEach(
    function (item) {

        observer.observe(item);

    }
);



const homePartCards =
    document.querySelectorAll(
        ".home-parts-reveal .home-part-panel"
    );


homePartCards.forEach(
    function (card) {

        observer.observe(card);

    }
);



const hero =
    document.querySelector(".hero");


if (hero) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 80) {

                hero.classList.add(
                    "scrolled"
                );

            } else {

                hero.classList.remove(
                    "scrolled"
                );

            }

        }
    );

}



const songItems =
    document.querySelectorAll(
        ".song-item"
    );


songItems.forEach(
    function (song) {

        song.addEventListener(
            "click",
            function () {

                const lyricsBoard =
                    song.nextElementSibling;


                if (!lyricsBoard) {
                    return;
                }


                if (
                    lyricsBoard.classList.contains(
                        "open"
                    )
                ) {

                    lyricsBoard.style.maxHeight =
                        null;

                    lyricsBoard.classList.remove(
                        "open"
                    );

                    song.classList.remove(
                        "active"
                    );

                } else {

                    lyricsBoard.classList.add(
                        "open"
                    );

                    lyricsBoard.style.maxHeight =
                        lyricsBoard.scrollHeight +
                        120 +
                        "px";

                    song.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);



if (menuButton && menu) {

    const menuLinks =
        document.querySelectorAll(
            ".menu a"
        );


    function updateMenuTextColor() {

        if (
            !menu.classList.contains("open")
        ) {

            return;

        }


        menu.style.visibility =
            "hidden";


        const menuRect =
            menu.getBoundingClientRect();


        const x =
            menuRect.left - 10;


        const y =
            window.innerHeight / 2;


        const backgroundElement =
            document.elementFromPoint(
                x,
                y
            );


        menu.style.visibility =
            "";


        if (!backgroundElement) {
            return;
        }


        const background =
            getComputedStyle(
                backgroundElement
            ).backgroundColor;


        const match =
            background.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)/
            );


        if (!match) {
            return;
        }


        const r =
            Number(match[1]);


        const g =
            Number(match[2]);


        const b =
            Number(match[3]);


        const brightness =
            (
                r * 299 +
                g * 587 +
                b * 114
            ) / 1000;


        if (brightness > 150) {

            menuLinks.forEach(
                function (link) {

                    link.style.color =
                        "black";

                }
            );

        } else {

            menuLinks.forEach(
                function (link) {

                    link.style.color =
                        "white";

                }
            );

        }

    }


    menuButton.addEventListener(
        "click",
        function () {

            setTimeout(
                function () {

                    updateMenuTextColor();

                },
                10
            );

        }
    );


    window.addEventListener(
        "scroll",
        function () {

            updateMenuTextColor();

        }
    );


    window.addEventListener(
        "resize",
        function () {

            updateMenuTextColor();

        }
    );

}



const activityReports =
    document.getElementById(
        "activityReports"
    );


const editActivityButton =
    document.getElementById(
        "editActivityButton"
    );


const activityAdminOverlay =
    document.getElementById(
        "activityAdminOverlay"
    );


const activityAdminClose =
    document.getElementById(
        "activityAdminClose"
    );


const activityPasswordArea =
    document.getElementById(
        "activityPasswordArea"
    );


const activityEmail =
    document.getElementById("activityEmail");


const activityPassword =
    document.getElementById(
        "activityPassword"
    );


const activityPasswordButton =
    document.getElementById(
        "activityPasswordButton"
    );


const activityPasswordError =
    document.getElementById(
        "activityPasswordError"
    );


const activityEditorArea =
    document.getElementById(
        "activityEditorArea"
    );


const activityTitle =
    document.getElementById(
        "activityTitle"
    );


const activityThumbnailFile =
    document.getElementById(
        "activityThumbnailFile"
    );


const activityThumbnailStatus =
    document.getElementById(
        "activityThumbnailStatus"
    );


const activityBody =
    document.getElementById(
        "activityBody"
    );


const activityPublishButton =
    document.getElementById(
        "activityPublishButton"
    );


const activityCancelEditButton =
    document.getElementById(
        "activityCancelEditButton"
    );


const activityPublishMessage =
    document.getElementById(
        "activityPublishMessage"
    );


const activityAdminReports =
    document.getElementById(
        "activityAdminReports"
    );



async function loadActivityReports() {

    if (!activityReports) {
        return;
    }


    if (!supabaseClient) {

        console.error(
            "Supabaseが利用できません。"
        );

        return;

    }


    try {

        const result =
            await supabaseClient
                .from("activity_reports")
                .select(
                    "id, created_at, title, thumbnail, body"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        const data =
            result.data;


        const error =
            result.error;


        if (error) {

            console.error(
                "活動報告の取得に失敗しました:",
                error
            );

            showActivityError();

            return;

        }


        activityReports.innerHTML =
            "";


        if (
            !data ||
            data.length === 0
        ) {

            activityReports.innerHTML = `
                <div class="activity-report-empty">

                    <span aria-hidden="true">
                        66
                    </span>

                    <p>
                        団全体の活動報告を、
                        こちらに掲載していきます。
                    </p>

                    <p>
                        現在、掲載内容を準備しています。
                    </p>

                </div>
            `;

            return;

        }


        data.forEach(
            function (report) {

                const article =
                    createActivityArticle(
                        report
                    );


                activityReports.appendChild(
                    article
                );

            }
        );

    } catch (error) {

        console.error(
            "活動報告処理中にエラーが発生しました:",
            error
        );

        showActivityError();

    }

}



function createActivityArticle(report) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "activity-report-card";


    if (report.thumbnail) {

        const thumbnail =
            document.createElement(
                "div"
            );


        thumbnail.className =
            "activity-report-thumbnail";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            report.thumbnail;


        image.alt =
            report.title ||
            "活動報告";


        thumbnail.appendChild(
            image
        );


        article.appendChild(
            thumbnail
        );

    }


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "activity-report-content";


    const date =
        document.createElement(
            "p"
        );


    date.className =
        "activity-report-date";


    const createdDate =
        new Date(
            report.created_at
        );


    date.textContent =
        createdDate.toLocaleDateString(
            "ja-JP",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    content.appendChild(
        date
    );


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        report.title ||
        "無題";


    content.appendChild(
        title
    );


    const body =
        document.createElement(
            "div"
        );


    body.className =
        "activity-report-body";


    body.textContent =
        report.body ||
        "";


    content.appendChild(
        body
    );


    article.appendChild(
        content
    );


    return article;

}



function showActivityError() {

    if (!activityReports) {
        return;
    }


    activityReports.innerHTML = `
        <div class="activity-report-empty">

            <span aria-hidden="true">
                !
            </span>

            <p>
                活動報告を読み込めませんでした。
            </p>

            <p>
                Consoleを確認してください。
            </p>

        </div>
    `;

}



if (
    editActivityButton &&
    activityAdminOverlay
) {

    editActivityButton.addEventListener(
        "click",
        async function () {

            activityAdminOverlay.classList.add(
                "open"
            );


            if (activityPasswordArea) {

                activityPasswordArea.style.display =
                    "block";

            }


            if (activityEditorArea) {

                activityEditorArea.style.display =
                    "none";

            }


            if (activityPasswordError) {

                activityPasswordError.textContent =
                    "";

            }


            if (activityPassword) activityPassword.value = "";
            if (activityEmail) activityEmail.value = "";
            try {
                if (await isSiteAdmin()) {
                    activityPasswordArea.style.display = "none";
                    activityEditorArea.style.display = "block";
                    await loadAdminActivityReports();
                } else if (activityEmail) {
                    activityEmail.focus();
                }
            } catch (error) {
                activityPasswordError.textContent = `管理者確認に失敗しました: ${error.message}`;
            }

        }
    );

}



if (activityAdminClose) {

    activityAdminClose.addEventListener(
        "click",
        function () {

            closeActivityAdmin();

        }
    );

}



if (activityAdminOverlay) {

    activityAdminOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                activityAdminOverlay
            ) {

                closeActivityAdmin();

            }

        }
    );

}



function closeActivityAdmin() {

    if (!activityAdminOverlay) {
        return;
    }


    activityAdminOverlay.classList.remove(
        "open"
    );


    resetActivityEditor();

}



if (activityPasswordButton) {

    activityPasswordButton.addEventListener(
        "click",
        async function () {
            try {
                await signInSiteAdmin(activityEmail.value.trim(), activityPassword.value);
                activityPasswordError.textContent = "";
                activityPasswordArea.style.display = "none";
                activityEditorArea.style.display = "block";
                activityPassword.value = "";
                activityEmail.value = "";
                await loadAdminActivityReports();
            } catch (error) {
                activityPasswordError.textContent = error.message || "ログインできませんでした。";
                activityPassword.value = "";
                activityEmail.focus();
            }

        }
    );

}



if (activityPassword) {

    activityPassword.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                if (activityPasswordButton) {

                    activityPasswordButton.click();

                }

            }

        }
    );

}



async function loadAdminActivityReports() {

    if (!activityAdminReports) {
        return;
    }


    activityAdminReports.innerHTML =
        "<p>読み込み中……</p>";


    if (!supabaseClient) {

        activityAdminReports.innerHTML =
            "<p>Supabaseが利用できません。</p>";

        return;

    }


    try {

        const result =
            await supabaseClient
                .from("activity_reports")
                .select(
                    "id, created_at, title, thumbnail, body"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        const data =
            result.data;


        const error =
            result.error;


        if (error) {

            console.error(
                "管理画面の記事取得エラー:",
                error
            );


            activityAdminReports.innerHTML =
                `<p>記事を取得できませんでした: ${error.message}</p>`;

            return;

        }


        activityAdminReports.innerHTML =
            "";


        if (
            !data ||
            data.length === 0
        ) {

            activityAdminReports.innerHTML =
                "<p>現在、記事はありません。</p>";

            return;

        }


        data.forEach(
            function (report) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "activity-admin-report-item";


                const title =
                    document.createElement(
                        "p"
                    );


                title.className =
                    "activity-admin-report-title";


                title.textContent =
                    report.title ||
                    "無題";


                item.appendChild(
                    title
                );


                const editButton =
                    document.createElement(
                        "button"
                    );


                editButton.type =
                    "button";


                editButton.textContent =
                    "編集";


                editButton.className =
                    "activity-report-edit-button";


                editButton.addEventListener(
                    "click",
                    function () {

                        startActivityEdit(
                            report
                        );

                    }
                );


                item.appendChild(
                    editButton
                );


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.textContent =
                    "削除";


                deleteButton.className =
                    "activity-report-delete-button";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteActivityReport(
                            report.id
                        );

                    }
                );


                item.appendChild(
                    deleteButton
                );


                activityAdminReports.appendChild(
                    item
                );

            }
        );
    } catch (error) {

        console.error(
            "管理画面処理エラー:",
            error
        );


        activityAdminReports.innerHTML =
            `<p>記事の読み込みに失敗しました: ${error.message || error}</p>`;

    }

}



function startActivityEdit(report) {

    activityEditorArea.dataset.editingId =
        report.id;


    activityEditorArea.dataset.editingThumbnail =
        report.thumbnail ||
        "";


    activityTitle.value =
        report.title ||
        "";


    activityBody.value =
        report.body ||
        "";


    activityThumbnailFile.value =
        "";


    activityThumbnailStatus.textContent =
        report.thumbnail
            ? "現在の画像を使用します。新しい画像を選ぶと変更されます。"
            : "画像はありません。";


    activityPublishButton.textContent =
        "変更を保存";


    activityCancelEditButton.style.display =
        "block";


    activityPublishMessage.textContent =
        "この記事を編集しています。";


    activityTitle.focus();

}



if (activityCancelEditButton) {

    activityCancelEditButton.addEventListener(
        "click",
        function () {

            resetActivityEditor();

        }
    );

}



function resetActivityEditor() {

    if (!activityEditorArea) {
        return;
    }


    activityEditorArea.dataset.editingId =
        "";


    activityEditorArea.dataset.editingThumbnail =
        "";


    if (activityTitle) {
        activityTitle.value = "";
    }


    if (activityBody) {
        activityBody.value = "";
    }


    if (activityThumbnailFile) {
        activityThumbnailFile.value = "";
    }


    if (activityThumbnailStatus) {
        activityThumbnailStatus.textContent = "";
    }


    if (activityPublishButton) {

        activityPublishButton.textContent =
            "公開する";

    }


    if (activityCancelEditButton) {

        activityCancelEditButton.style.display =
            "none";

    }


    if (activityPublishMessage) {

        activityPublishMessage.textContent =
            "";

    }

}



if (activityThumbnailFile) {

    activityThumbnailFile.addEventListener(
        "change",
        function () {

            const file =
                activityThumbnailFile.files[0];


            if (!file) {

                activityThumbnailStatus.textContent =
                    "";

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                activityThumbnailStatus.textContent =
                    "画像ファイルを選択してください。";

                activityThumbnailFile.value =
                    "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                activityThumbnailStatus.textContent =
                    "画像は10MB以下にしてください。";

                activityThumbnailFile.value =
                    "";

                return;

            }


            activityThumbnailStatus.textContent =
                "選択中: " +
                file.name;

        }
    );

}



if (activityPublishButton) {

    activityPublishButton.addEventListener(
        "click",
        async function () {

            const title =
                activityTitle.value.trim();


            const body =
                activityBody.value.trim();


            const imageFile =
                activityThumbnailFile.files[0];


            const editingId =
                activityEditorArea.dataset.editingId ||
                "";


            const originalThumbnail =
                activityEditorArea.dataset.editingThumbnail ||
                "";


            if (!title) {

                activityPublishMessage.textContent =
                    "題名を入力してください。";

                activityTitle.focus();

                return;

            }


            if (!body) {

                activityPublishMessage.textContent =
                    "本文を入力してください。";

                activityBody.focus();

                return;

            }


            activityPublishButton.disabled =
                true;


            activityPublishMessage.textContent =
                editingId
                    ? "変更を保存しています……"
                    : "公開しています……";


            try {

                let thumbnailUrl =
                    null;



                if (imageFile) {

                    if (
                        !imageFile.type.startsWith(
                            "image/"
                        )
                    ) {

                        activityPublishMessage.textContent =
                            "画像ファイルを選択してください。";

                        return;

                    }


                    if (
                        imageFile.size >
                        10 * 1024 * 1024
                    ) {

                        activityPublishMessage.textContent =
                            "画像は10MB以下にしてください。";

                        return;

                    }


                    const extension =
                        imageFile.name
                            .split(".")
                            .pop()
                            .toLowerCase();


                    const fileName =
                        Date.now() +
                        "-" +
                        crypto.randomUUID() +
                        "." +
                        extension;


                    activityPublishMessage.textContent =
                        "画像をアップロードしています……";


                    const uploadResult =
                        await supabaseClient
                            .storage
                            .from(
                                "activity-images"
                            )
                            .upload(
                                fileName,
                                imageFile,
                                {
                                    cacheControl:
                                        "3600",

                                    upsert:
                                        false
                                }
                            );


                    if (
                        uploadResult.error
                    ) {

                        console.error(
                            "画像アップロードエラー:",
                            uploadResult.error
                        );


                        activityPublishMessage.textContent =
                            "画像のアップロードに失敗しました。";

                        return;

                    }


                    const publicUrlResult =
                        supabaseClient
                            .storage
                            .from(
                                "activity-images"
                            )
                            .getPublicUrl(
                                fileName
                            );


                    thumbnailUrl =
                        publicUrlResult
                            .data
                            .publicUrl;

                }



                if (editingId) {

                    const finalThumbnail =
                        thumbnailUrl ||
                        originalThumbnail ||
                        null;


                    const result =
                        await supabaseClient
                            .from(
                                "activity_reports"
                            )
                            .update(
                                {
                                    title:
                                        title,

                                    thumbnail:
                                        finalThumbnail,

                                    body:
                                        body
                                }
                            )
                            .eq(
                                "id",
                                editingId
                            )
                            .select("id")
                            .maybeSingle();


                    if (result.error) {

                        console.error(
                            "記事編集エラー:",
                            result.error
                        );


                        activityPublishMessage.textContent =
                            `変更を保存できませんでした: ${result.error.message}`;

                        return;

                    }


                    if (!result.data) {

                        activityPublishMessage.textContent =
                            "保存対象の記事が見つからないか、Supabaseで編集権限が許可されていません。activity_reportsの更新ポリシーを確認してください。";

                        return;

                    }


                    activityPublishMessage.textContent =
                        "変更を保存しました！";


                } else {


                    const result =
                        await supabaseClient
                            .from(
                                "activity_reports"
                            )
                            .insert(
                                [
                                    {
                                        title:
                                            title,

                                        thumbnail:
                                            thumbnailUrl,

                                        body:
                                            body
                                    }
                                ]
                            );


                    if (result.error) {

                        console.error(
                            "記事追加エラー:",
                            result.error
                        );


                        activityPublishMessage.textContent =
                            "記事の公開に失敗しました。";

                        return;

                    }


                    activityPublishMessage.textContent =
                        "公開しました！";

                }


                resetActivityEditor();


                await loadActivityReports();


                await loadAdminActivityReports();


            } catch (error) {

                console.error(
                    "活動報告保存エラー:",
                    error
                );


                activityPublishMessage.textContent =
                    "エラーが発生しました。Consoleを確認してください。";

            } finally {

                activityPublishButton.disabled =
                    false;

            }

        }
    );

}



async function deleteActivityReport(id) {

    const confirmed =
        window.confirm(
            "この活動報告を削除しますか？"
        );


    if (!confirmed) {
        return;
    }


    try {

        if (!supabaseClient) {

            alert(
                "Supabaseが利用できません。"
            );

            return;

        }


        const result =
            await supabaseClient
                .from(
                    "activity_reports"
                )
                .delete()
                .eq(
                    "id",
                    id
                );


        if (result.error) {

            console.error(
                "記事削除エラー:",
                result.error
            );


            alert(
                "削除に失敗しました。Consoleを確認してください。"
            );

            return;

        }


        alert(
            "削除しました。"
        );


        await loadActivityReports();


        await loadAdminActivityReports();


    } catch (error) {

        console.error(
            "削除処理エラー:",
            error
        );


        alert(
            "エラーが発生しました。"
        );

    }

}



if (activityReports) {

    loadActivityReports();

}

if (activityEmail) {
    activityEmail.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            activityPassword.focus();
        }
    });
}

const activityAdminLogout = document.getElementById("activityAdminLogout");
if (activityAdminLogout) {
    activityAdminLogout.addEventListener("click", async () => {
        try {
            await signOutSiteAdmin();
            activityEditorArea.style.display = "none";
            activityPasswordArea.style.display = "block";
            activityPasswordError.textContent = "ログアウトしました。";
            if (activityEmail) activityEmail.focus();
        } catch (error) {
            activityPasswordError.textContent = `ログアウトできませんでした: ${error.message}`;
        }
    });
}


const aboutSubmenuToggle =
    document.querySelector(".menu-submenu-toggle");

if (aboutSubmenuToggle) {

    const aboutSubmenu =
        document.getElementById("aboutSubmenu");

    if (aboutSubmenu) {

        aboutSubmenuToggle.addEventListener(
            "click",
            function () {

                const isExpanded =
                    aboutSubmenuToggle.getAttribute("aria-expanded") === "true";

                aboutSubmenuToggle.setAttribute(
                    "aria-expanded",
                    String(!isExpanded)
                );

                aboutSubmenu.hidden = isExpanded;

                const indicator =
                    aboutSubmenuToggle.querySelector("span");

                if (indicator) {
                    indicator.textContent = isExpanded ? "＋" : "－";
                }

            }
        );

    }

}


const welcomePosts = document.getElementById("welcomePosts");
if (welcomePosts) {
    const overlay = document.getElementById("welcomeAdminOverlay");
    const openButton = document.getElementById("welcomeAdminOpen");
    const closeButton = document.getElementById("welcomeAdminClose");
    const passwordArea = document.getElementById("welcomePasswordArea");
    const passwordInput = document.getElementById("welcomePassword");
    const emailInput = document.getElementById("welcomeEmail");
    const passwordButton = document.getElementById("welcomePasswordButton");
    const passwordError = document.getElementById("welcomePasswordError");
    const editorArea = document.getElementById("welcomeEditorArea");
    const form = document.getElementById("welcomePostForm");
    const titleInput = document.getElementById("welcomeTitle");
    const dateInput = document.getElementById("welcomeDate");
    const locationInput = document.getElementById("welcomeLocation");
    const bodyInput = document.getElementById("welcomeBody");
    const urlInput = document.getElementById("welcomeUrl");
    const saveButton = document.getElementById("welcomeSaveButton");
    const cancelEditButton = document.getElementById("welcomeCancelEdit");
    const saveMessage = document.getElementById("welcomeSaveMessage");
    const adminPosts = document.getElementById("welcomeAdminPosts");
    const logoutButton = document.getElementById("welcomeAdminLogout");
    let cachedPosts = [];

    function formatWelcomeDate(value) {
        if (!value) return "日程調整中";
        const date = new Date(`${value}T00:00:00`);
        return Number.isNaN(date.getTime())
            ? "日程調整中"
            : date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
    }

    function appendWelcomePost(container, post) {
        const article = document.createElement("article");
        article.className = "welcome-post-card";

        const date = document.createElement("p");
        date.className = "welcome-post-date";
        date.textContent = formatWelcomeDate(post.event_date);
        article.appendChild(date);

        const title = document.createElement("h3");
        title.textContent = post.title || "企画のお知らせ";
        article.appendChild(title);

        if (post.location) {
            const location = document.createElement("p");
            location.className = "welcome-post-location";
            location.textContent = post.location;
            article.appendChild(location);
        }

        const body = document.createElement("p");
        body.className = "welcome-post-body";
        body.textContent = post.body || "";
        article.appendChild(body);

        if (post.details_url) {
            try {
                const url = new URL(post.details_url);
                if (url.protocol === "https:" || url.protocol === "http:") {
                    const link = document.createElement("a");
                    link.href = url.href;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.className = "welcome-post-link";
                    link.textContent = "企画の詳細を見る ↗";
                    article.appendChild(link);
                }
            } catch (_) {
            }
        }

        container.appendChild(article);
    }

    async function loadWelcomePosts() {
        if (!supabaseClient) {
            welcomePosts.innerHTML = '<p class="welcome-empty">お知らせを読み込めませんでした。</p>';
            return;
        }

        welcomePosts.innerHTML = '<p class="welcome-empty">企画情報を読み込んでいます。</p>';
        const { data, error } = await supabaseClient
            .from("welcome_posts")
            .select("id, title, event_date, location, body, details_url, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("新歓企画の取得に失敗しました:", error);
            welcomePosts.innerHTML = '<p class="welcome-empty">企画情報を読み込めませんでした。Supabaseのwelcome_posts設定をご確認ください。</p>';
            if (adminPosts) adminPosts.textContent = `読み込みエラー: ${error.message}`;
            return;
        }

        cachedPosts = data || [];
        welcomePosts.replaceChildren();
        if (cachedPosts.length === 0) {
            welcomePosts.innerHTML = '<p class="welcome-empty">新歓や見学・体験の企画情報を、こちらでお知らせします。</p>';
        } else {
            cachedPosts.forEach((post) => appendWelcomePost(welcomePosts, post));
        }
        renderWelcomeAdminPosts();
    }

    function renderWelcomeAdminPosts() {
        if (!adminPosts) return;
        adminPosts.replaceChildren();
        if (cachedPosts.length === 0) {
            adminPosts.innerHTML = "<p>投稿済みの企画はありません。</p>";
            return;
        }

        cachedPosts.forEach((post) => {
            const row = document.createElement("div");
            row.className = "welcome-admin-post";
            const title = document.createElement("span");
            title.textContent = post.title;
            row.appendChild(title);

            const actions = document.createElement("div");
            actions.className = "welcome-admin-actions";
            const edit = document.createElement("button");
            edit.type = "button";
            edit.textContent = "編集";
            edit.addEventListener("click", () => {
                form.dataset.editingId = post.id;
                titleInput.value = post.title || "";
                dateInput.value = post.event_date || "";
                locationInput.value = post.location || "";
                bodyInput.value = post.body || "";
                urlInput.value = post.details_url || "";
                saveButton.textContent = "変更を保存";
                cancelEditButton.hidden = false;
                saveMessage.textContent = "この記事を編集中です。";
                titleInput.focus();
            });
            actions.appendChild(edit);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "welcome-delete-button";
            remove.textContent = "削除";
            remove.addEventListener("click", async () => {
                if (!window.confirm(`「${post.title}」を削除しますか？`)) return;
                const { error } = await supabaseClient.from("welcome_posts").delete().eq("id", post.id);
                if (error) {
                    saveMessage.textContent = `削除できませんでした: ${error.message}`;
                    return;
                }
                saveMessage.textContent = "企画を削除しました。";
                await loadWelcomePosts();
            });
            actions.appendChild(remove);
            row.appendChild(actions);
            adminPosts.appendChild(row);
        });
    }

    function resetWelcomeForm() {
        form.reset();
        form.dataset.editingId = "";
        saveButton.textContent = "投稿する";
        cancelEditButton.hidden = true;
        saveMessage.textContent = "";
    }

    openButton.addEventListener("click", async () => {
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        passwordArea.hidden = false;
        editorArea.hidden = true;
        passwordInput.value = "";
        emailInput.value = "";
        passwordError.textContent = "";
        try {
            if (await isSiteAdmin()) {
                passwordArea.hidden = true;
                editorArea.hidden = false;
                await loadWelcomePosts();
            } else {
                emailInput.focus();
            }
        } catch (error) {
            passwordError.textContent = `管理者確認に失敗しました: ${error.message}`;
        }
    });

    closeButton.addEventListener("click", () => {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        passwordInput.value = "";
        emailInput.value = "";
        resetWelcomeForm();
    });

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeButton.click();
    });

    passwordButton.addEventListener("click", async () => {
        try {
            await signInSiteAdmin(emailInput.value.trim(), passwordInput.value);
            passwordError.textContent = "";
            passwordArea.hidden = true;
            editorArea.hidden = false;
            passwordInput.value = "";
            emailInput.value = "";
            renderWelcomeAdminPosts();
        } catch (error) {
            passwordError.textContent = error.message || "ログインできませんでした。";
            passwordInput.value = "";
            emailInput.focus();
        }
    });

    emailInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordInput.focus();
        }
    });

    logoutButton.addEventListener("click", async () => {
        try {
            await signOutSiteAdmin();
            editorArea.hidden = true;
            passwordArea.hidden = false;
            passwordError.textContent = "ログアウトしました。";
            emailInput.focus();
        } catch (error) {
            saveMessage.textContent = `ログアウトできませんでした: ${error.message}`;
        }
    });

    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordButton.click();
        }
    });

    cancelEditButton.addEventListener("click", resetWelcomeForm);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!supabaseClient) {
            saveMessage.textContent = "Supabaseに接続できません。";
            return;
        }

        const post = {
            title: titleInput.value.trim(),
            event_date: dateInput.value || null,
            location: locationInput.value.trim() || null,
            body: bodyInput.value.trim(),
            details_url: urlInput.value.trim() || null
        };
        const editingId = form.dataset.editingId || "";
        saveButton.disabled = true;
        saveMessage.textContent = editingId ? "変更を保存しています……" : "企画を投稿しています……";

        try {
            const result = editingId
                ? await supabaseClient.from("welcome_posts").update(post).eq("id", editingId).select("id").maybeSingle()
                : await supabaseClient.from("welcome_posts").insert(post).select("id").single();

            if (result.error) {
                saveMessage.textContent = `保存できませんでした: ${result.error.message}`;
                return;
            }
            if (editingId && !result.data) {
                saveMessage.textContent = "更新権限がありません。Supabaseのwelcome_posts更新ポリシーをご確認ください。";
                return;
            }

            resetWelcomeForm();
            saveMessage.textContent = editingId ? "変更を保存しました。" : "企画を投稿しました。";
            await loadWelcomePosts();
        } catch (error) {
            console.error("新歓企画の保存に失敗しました:", error);
            saveMessage.textContent = `保存に失敗しました: ${error.message || error}`;
        } finally {
            saveButton.disabled = false;
        }
    });

    loadWelcomePosts().catch((error) => {
        console.error("新歓企画の読み込みに失敗しました:", error);
        welcomePosts.innerHTML = '<p class="welcome-empty">企画情報を読み込めませんでした。</p>';
    });
}
