<script>
    import { decryptCalls } from "./AlgoEncrypt/algoHandler.js";
    import NavBar from "./NavBar.svelte";
    import { color, cardColor } from "../stores/stateStore";

    let key = "";
    let encryptedInput = "";
    let decryptedText = "";
    let selectedInputType = null; // valid type : fichier / texte / image)
    let isDecrypted = false;

    let filename = "decrypted";
    let selectedFormat = "txt";

    function copyToClipboard() {
        navigator.clipboard
            .writeText(decryptedText)
            .then(() => {
                alert("Texte copié !");
            })
            .catch((err) => {
                alert("Échec de la copie : " + err);
            });
    }

    function downloadDecryptedOutput() {
        if (!decryptedText) return;

        const blob = new Blob([decryptedText], {
            type: "text/plain;charset=utf-8",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${filename || "decrypted"}.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // trigger
    function decryptText() {
        if (!key || !encryptedInput) {
            decryptedText = "Veuillez entrer une clé et un texte chiffré.";
            return;
        }
        isDecrypted = true;
        decryptedText = decryptCalls(key, encryptedInput);
    }

    function handleInputType(type) {
        selectedInputType = type;
        encryptedInput = "";
    }

    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                encryptedInput = e.target.result;
            };
            reader.readAsText(file);
        }
    }

    function handleImageInput(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                const marker = "encrypted-data:";
                const markerIndex = base64.indexOf(marker);

                if (markerIndex !== -1) {
                    encryptedInput = base64.substring(
                        markerIndex + marker.length,
                    );
                } else {
                    encryptedInput = "";
                    decryptedText =
                        "Aucune donnée chiffrée trouvée dans l’image.";
                }
            };
            reader.readAsDataURL(file);
        } else {
            decryptedText =
                "Le fichier sélectionné n’est pas une image valide.";
        }
    }
</script>

<div id="wrapper">
    <main
        class="main-container"
        style="background-color: {$cardColor}; color: {$color}"
    >
        <NavBar />

        <form class="form" on:submit|preventDefault={decryptText}>
            <div class="form-group">
                <label for="key" style="color: grey;">Clé :</label>
                <input
                    type="text"
                    id="key"
                    bind:value={key}
                    placeholder="Entrez la clé de chiffrement"
                    style="color: grey;"
                />
            </div>

            <!-- Input type -->
            <div class="input-options">
                <button
                    on:click={() => handleInputType("file")}
                    class="input-btn"
                    style="background-color: {$cardColor}; color: {$color};"
                >
                    📁 Fichier
                </button>
                <button
                    on:click={() => handleInputType("text")}
                    class="input-btn"
                    style="background-color: {$cardColor}; color: {$color};"
                >
                    📝 Texte
                </button>
                <button
                    on:click={() => handleInputType("image")}
                    class="input-btn"
                    style="background-color: {$cardColor}; color: {$color};"
                >
                    🖼️ Image
                </button>
            </div>

            <!-- Input display -->
            {#if selectedInputType === "text"}
                <div class="form-group">
                    <label for="encryptedInput" style="color: grey;"
                        >Texte chiffré :</label
                    >
                    <input
                        type="text"
                        id="encryptedInput"
                        bind:value={encryptedInput}
                        placeholder="Entrez le texte chiffré (décimal)"
                        style="color: grey;"
                    />
                </div>
            {:else if selectedInputType === "file"}
                <div class="form-group">
                    <label for="fileInput" style="color: grey;"
                        >Fichier chiffré :</label
                    >
                    <input
                        type="file"
                        id="fileInput"
                        on:change={(e) => handleFileInput(e)}
                    />
                </div>
            {:else if selectedInputType === "image"}
                <div class="form-group">
                    <label for="imageInput" style="color: grey;"
                        >Image chiffrée :</label
                    >
                    <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        on:change={(e) => handleImageInput(e)}
                    />
                </div>
            {/if}

            <button
                type="submit"
                style="background-color: {color}; color: white; border-radius: 0.5rem; margin-bottom: 0vh;"
            >
                Décrypter
            </button>
        </form>

        <!-- résultat décrypté -->
        {#if isDecrypted && decryptedText}
            <div
                class="result"
                style="background-color: {$cardColor}; overflow-y: scroll; max-height: 20vh; max-width: 98vw;"
                align="center"
            >
                <h3>Texte décrypté :</h3>
                <p style="max-width: 80%;">{decryptedText}</p>
            </div>
            <div
                align="center"
                style="margin-top: 2vh; padding-top: 1vh; padding-bottom: 2vh; display: flex; justify-content: center; gap: 1rem; align-items: center; flex-wrap: wrap;"
            >
                <button on:click={copyToClipboard}>📋 Copier</button>

                <input
                    type="text"
                    placeholder="Nom du fichier"
                    bind:value={filename}
                    style="max-width: 200px; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #ccc;"
                />

                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <label for="format-select" style="color: grey;"
                        >Format</label
                    >
                    <select
                        id="format-select"
                        bind:value={selectedFormat}
                        style="border-radius: 0.5rem; padding: 0.4rem;"
                    >
                        <option value="txt">.txt</option>
                        <option value="csv">.csv</option>
                    </select>
                </div>

                <button
                    on:click={downloadDecryptedOutput}
                    style="background-color: green; color: white;"
                >
                    ⬇️ Télécharger
                </button>
            </div>
        {/if}
    </main>
</div>

<style>
    #wrapper {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #e0e0e0;
    }

    .main-container {
        min-width: 96vw;
        height: 96vh;
        padding: 2vh;
        background-color: #f2f2f2;
        border-radius: 1vh;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
    }

    .input-options {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 4rem;
        margin-bottom: 2rem;
    }

    .input-btn {
        padding: 0.8rem 1.5rem;
        background-color: #7f9bb8;
        border: solid grey 0.2vh;
        color: white;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .input-btn:hover {
        background-color: #0056b3;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-weight: bold;
        color: #333;
    }

    input {
        padding: 0.8rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    button {
        padding: 0.8rem 1.2rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
        width: fit-content;
        align-self: center;
    }

    button:hover {
        background-color: #0056b3;
    }

    .result {
        margin-top: 2rem;
        padding: 1rem;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
    }

    .result h3 {
        margin-bottom: 0.5rem;
    }

    .result p {
        font-size: 1.1rem;
        color: #555;
        word-break: break-word;
    }
</style>
