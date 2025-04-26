<script>
    import { Button, Modal, Alert } from "sveltestrap";
    import { state, mode, cardColor, color } from "../stores/stateStore";

    let open = false;
    const toggle = () => (open = !open);

    function setState(target) {
        state.set(target);
        console.log(target);
    }

    function toggleMode() {
        mode.update((m) => (m === "light" ? "dark" : "light"));
    }
</script>

<main class="main" style="background-color: {$cardColor}; color: {$color}">
    {#if $state == "generator"}
        <Button color="primary" on:click={() => setState("decryptor")}>
            Décryptage
        </Button>
    {:else if $state === "decryptor"}
        <Button color="primary" on:click={() => setState("generator")}>
            Encryption
        </Button>
    {/if}

    <Button color="dark" on:click={toggle}>FAQ</Button>

    <div class="mode-button">
        <Button
            color="secondary"
            title="Profil utilisateur"
            on:click={toggleMode}
        >
            <b>{$mode === "light" ? "🌙" : "☀️"}</b>
        </Button>
    </div>

    <Modal
        header="Fonctionnalités & Confidentialité"
        isOpen={open}
        {toggle}
        size="lg"
    >
        <div
            class="modal-body"
            class:dark={$mode === "dark"}
            class:light={$mode === "light"}
            style="margin: 2vh;"
        >
            <p>
                Voici les points clés concernant la sécurité et la
                confidentialité de cette application :
            </p>
            <ul class="faq-list">
                <li>
                    🔐 <strong>Pas de cookies</strong><br />
                    Aucun cookie n’est utilisé pour suivre ou enregistrer votre activité.
                </li>
                <li>
                    🗃️ <strong>Pas de base de données</strong><br />
                    Toutes les opérations sont effectuées localement, aucune donnée
                    n’est stockée côté serveur.
                </li>
                <li>
                    🧩 <strong>Stockage encrypté sur mesure</strong><br />
                    Les résultats sont stockés selon le mode de chiffrement que vous
                    choisissez. Aucun accès extérieur n’est possible.
                </li>
                <li>
                    ⏱️ <strong>Pas de presse-papier persistant</strong><br />
                    Si vous copiez un message, il est automatiquement supprimé du
                    presse-papier après 15 secondes.
                </li>
                <li>
                    🔓 <strong>Chiffrement symétrique & open source</strong><br
                    />
                    L’algorithme utilisé est public, consultable et fondé sur un
                    système de clé symétrique pour garantir transparence et sécurité.
                </li>
            </ul>
            <p align="center" style="margin: 4vh;">
                🔗 Code source disponible ici :
                <a href="https://github.com/ton-utilisateur/#" target="_blank">
                    git url
                </a>
            </p>

            <Alert color="success">
                ✅ Aucune trace de l'utilisateur ou de ses documents n'est
                conservée avant, pendant ou après le chiffrement. Tout se passe
                localement.
            </Alert>
        </div>
    </Modal>
</main>

<style>
    .main {
        border-radius: 1vh;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: flex-start;
        padding: 2rem;
        flex-wrap: wrap;
        transition:
            background-color 0.3s,
            color 0.3s;
    }

    /* Night Mode Styles */
    /* Modal Styles for Dark and Light Modes */
    .modal-body {
        padding: 2vh;
        transition:
            background-color 0.3s,
            color 0.3s;
    }

    .modal-body.dark {
        background-color: #333;
        color: #e0e0e0;
    }

    .modal-body.light {
        background-color: #fff;
        color: #333;
    }

    .faq-list {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
    }

    .faq-list li {
        margin-bottom: 1rem;
        font-size: 1rem;
        line-height: 1.5;
    }

    .faq-list li strong {
        display: inline-block;
        margin-bottom: 0.3rem;
    }

    .mode-button {
        margin-left: auto;
    }
</style>
