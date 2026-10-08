(() => {
    const openButtons = document.querySelectorAll("[data-member-open]");
    if (!openButtons.length) return;

    let activeModal = null;
    let activeButton = null;

    function closeModal() {
        if (!activeModal) return;

        activeModal.hidden = true;
        activeModal.setAttribute("aria-hidden", "true");
        activeButton?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("member-modal-open");

        const returnFocus = activeButton;
        activeModal = null;
        activeButton = null;
        returnFocus?.focus({ preventScroll: true });
    }

    openButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.memberOpen);
            if (!modal) return;

            if (activeModal) closeModal();

            activeModal = modal;
            activeButton = button;
            modal.hidden = false;
            modal.setAttribute("aria-hidden", "false");
            button.setAttribute("aria-expanded", "true");
            document.body.classList.add("member-modal-open");
            modal.querySelector(".member-modal-close")?.focus();
        });
    });

    document.addEventListener("click", (event) => {
        if (!activeModal) return;
        if (event.target.closest("[data-member-close]")) closeModal();
    });

    document.addEventListener("keydown", (event) => {
        if (!activeModal) return;

        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }

        if (event.key === "Tab") {
            const focusable = activeModal.querySelector(".member-modal-close");
            if (focusable) {
                event.preventDefault();
                focusable.focus();
            }
        }
    });
})();
