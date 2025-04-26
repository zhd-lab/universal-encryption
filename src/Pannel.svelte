<script>
    import { state, color, cardColor } from "../stores/stateStore";
    import NavBar from "./NavBar.svelte";

    function setState(target) {
        state.set(target);
        console.log(target);
    }
</script>

<main id="main" style="background-color: {$cardColor}; color: {$color}">
    <NavBar />

    <div
        class="custom-card first"
        style="background-color: {$cardColor}; color: {$color};"
    >
        <div class="card-content">
            <h2 class="card-title">🔐 Générateur</h2>
            <p class="card-text">
                Ce module vous permet de crypter des données sensibles.<br />
                Utilisez-le pour générer une chaîne sécurisée à partir de vos informations.
            </p>
            <div align="center">
                <button
                    class="card-button primary"
                    on:click={() => setState("generator")}
                >
                    Lancer l'encryption
                </button>
            </div>
        </div>
    </div>

    <div
        class="custom-card second"
        style="background-color: {$cardColor}; color: {$color};"
    >
        <div class="card-content">
            <h2 class="card-title">🔓 Décrypteur</h2>
            <p class="card-text">
                Ce module vous permet de décrypter des données cryptées
                précédemment. Assurez-vous d’avoir la clé correcte pour accéder
                aux données originales.
            </p>
            <div align="center">
                <button
                    class="card-button success"
                    on:click={() => setState("decryptor")}
                >
                    Lancer le décryptage
                </button>
            </div>
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 2vh;
        gap: 3vh;
    }

    .custom-card {
        all: unset;
        border: 1px solid #dee2e6;
        border-radius: 0.5rem;
        width: 80%;
        max-width: 600px;
        text-align: left;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 260px;
        padding: 2.5rem;
        cursor: default;
    }

    .custom-card:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .card-title {
        text-align: center;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .card-text {
        margin-top: 6vh;
        font-size: 1rem;
        flex-grow: 1;
    }

    .card-button {
        margin-top: 1.5rem;
        padding: 0.6rem 1rem;
        border-radius: 0.375rem;
        border-width: 0vh;
        font-weight: 500;
        text-align: center;
        user-select: none;
        cursor: pointer;
    }

    .primary {
        background-color: #0d6efd;
        color: white;
    }

    .success {
        background-color: #198754;
        color: white;
    }
</style>
