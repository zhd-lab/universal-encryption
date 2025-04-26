<script>
    import {
        Card,
        Input,
        Progress,
        Button,
        Badge,
        Modal,
        Alert,
    } from "sveltestrap";
    import { color, cardColor, InputColor } from "../stores/stateStore";
    import { encryptCalls } from "./AlgoEncrypt/algoHandler.js";
    import NavBar from "./NavBar.svelte";

    let showAsciiContainer = false; // Toggle ASCII table
    let inputValue = "";
    let file = null;

    const asciiValues = Array.from({ length: 95 }, (_, i) => i + 32); // ASCII printable

    const asciiCardStyle =
        "padding: 1vh; text-align: center; font-size: 0.9rem; border: 1px solid #bbb; border-radius: 0.5vh;";

    const inputTextStyle = "flex-grow: 1; min-width: 0;";

    let fileContent = "";

    let openModalIndex = null;
    const toggle = (index) => {
        openModalIndex = openModalIndex === index ? null : index;
    };

    $: inputDecimalValues = inputValue
        .split("")
        .map((char) => char.charCodeAt(0));

    $: fileDecimalValues = fileContent
        .split("")
        .map((char) => char.charCodeAt(0));

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            fileContent = e.target.result;
        };
        reader.readAsText(selectedFile); // read
    }

    // nb detected char
    $: highlightedCount = asciiValues.filter((val) =>
        inputValue.includes(String.fromCharCode(val)),
    ).length;

    // coverage % / 95
    $: coveragePercent = Math.round(
        (highlightedCount / asciiValues.length) * 100,
    );

    // progreess color
    $: progressColor =
        highlightedCount === 0
            ? "light"
            : highlightedCount <= 10
              ? "info"
              : highlightedCount <= 50
                ? "warning"
                : highlightedCount <= 80
                  ? "danger"
                  : "success";

    // encrypt trigger
    $: encryptedOutput = encryptCalls(inputValue, fileContent);

    // encrypted output cpy (key / str)
    let alert = false;
    let alertMsg = "";
    let countIndex = 15;

    function copyToClipboard(type) {
        const textToCopy = type === "str" ? encryptedOutput : inputValue;

        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                if (type === "str") {
                    alertMsg = "Encrypted output copié";
                } else if (type === "key") {
                    alertMsg = "Clef copiée";
                }
                alert = true;
                countIndex = 15;

                const interval = setInterval(() => {
                    countIndex -= 1;
                    if (countIndex <= 0) {
                        clearInterval(interval);
                        alert = false;
                        // clear clipboard
                        navigator.clipboard.writeText("");
                    }
                }, 1000); // every 1k ms
            })
            .catch((err) => {
                alert("Failed to copy text: ", err);
            });
    }

    // output handler
    let selectedFormat = "txt";
    let filename = "encrypted_output"; // default name

    function downloadEncryptedOutput() {
        const blob = new Blob([encryptedOutput], {
            type: selectedFormat === "csv" ? "text/csv" : "text/plain",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename || "encrypted_output"}.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
</script>

<div id="wrapper" style="background-color: {$cardColor};">
    <main class="main-container">
        {#if alert === true}
            <Alert
                color="light"
                style="display: flex; justify-content: space-between; align-items: center;"
            >
                <Button disabled outline color="success">
                    {alertMsg}
                </Button>
                <Button color="light" class="position-relative">
                    nettoyage <Badge
                        color="success"
                        pill
                        positioned
                        ariaLabel="Unread messages"
                    >
                        {countIndex}
                    </Badge>
                </Button>
            </Alert>
        {/if}

        <NavBar />
        <br />
        <!-- Input texte + fichier -->
        <div class="top-bar">
            <!-- Toggle ASCII view -->
            <div
                style="margin: 1vh 0; display: flex; justify-content: flex-end;"
            >
                <Button
                    on:click={() => (showAsciiContainer = !showAsciiContainer)}
                    color={showAsciiContainer ? "dark" : "light"}
                >
                    <b>{showAsciiContainer ? "-" : "+"}</b>
                </Button>
            </div>

            <Input
                type="text"
                placeholder="Entrez une clef ou une phrase"
                bind:value={inputValue}
                style={inputTextStyle}
                class="input-field"
            />
            <Button color={fileContent ? "dark" : "secondary"}>
                <input
                    type="file"
                    accept=".txt, .csv"
                    on:change={handleFileChange}
                    class="input-file"
                />
            </Button>
        </div>

        <div class="highlight-progress">
            <span style="color: grey;"
                >Points d'encryption : <strong>{highlightedCount}</strong></span
            >
            <Progress
                value={coveragePercent}
                color={progressColor}
                style="flex: 1; margin-left: 1rem;"
            />
        </div>

        <!-- ASCII table -->
        {#if showAsciiContainer}
            <div class="ascii-container">
                {#each asciiValues as val, index}
                    <div
                        style="background-color: {$cardColor}; color: {$color}; border: solid black 0.2vh; padding: 0.2vh; border-radius: 1vh;"
                        color={inputValue.includes(String.fromCharCode(val))
                            ? "secondary"
                            : "light"}
                    >
                        <div align="right">
                            <Button
                                id={"ascii-info-" + index}
                                color="primary"
                                style="max-height: 4vh; font-size: 1.5vh; padding: 0.2vh 0.6vh; color: {$color}; background-color: {$cardColor};"
                                on:click={() => toggle(index)}
                            >
                                <i>i</i>
                            </Button>

                            <Modal
                                body
                                header={`Caractère ASCII: ${String.fromCharCode(val)}`}
                                isOpen={openModalIndex === index}
                                toggle={() => toggle(index)}
                            >
                                <p style="margin-top: 2vh;">
                                    {#if inputValue.includes(String.fromCharCode(val))}
                                        <Badge color="primary">utilisé</Badge>
                                    {:else}
                                        <Badge color="secondary"
                                            >non utilisé</Badge
                                        >
                                    {/if}

                                    <strong style="margin-left: 2vh;"
                                        >Décimal:</strong
                                    >
                                    {val}

                                    <strong>Char:</strong>
                                    {String.fromCharCode(val)}
                                    <br />
                                </p>
                            </Modal>
                        </div>
                        <div align="center">
                            <div><strong>Dec:</strong> {val}</div>
                            <div>
                                <strong>Char:</strong>
                                {String.fromCharCode(val)}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
        
        <div
            class="input-preview"
            style="background-color: {$cardColor}; color: {$color}"
        >
            <strong>Clef </strong><Button
                color="primary"
                on:click={() => {
                    copyToClipboard("key");
                }}>Copier</Button
            >
            <pre>{inputValue}</pre>
        </div>

        {#if showAsciiContainer}
            <div
                class="decimal-preview"
                style="background-color: {$cardColor}; color: {$color}"
            >
                <strong>Key Decimals :</strong>
                <pre>{inputDecimalValues.join(" ")}</pre>
            </div>
        {/if}

        {#if fileContent}
            <div
                class="decimal-preview"
                style="background-color: {$cardColor}; color: {$color}"
            >
                <strong>Valeurs décimales du fichier :</strong>
                <pre>{fileDecimalValues.join(" ")}</pre>
            </div>
        {/if}

        <!-- crypted output -->
        {#if fileContent && inputValue}
            <div
                class="hex-preview"
                style="background-color: {$cardColor}; color: {$color}"
            >
                <strong>encrypted output</strong>
                <pre>{encryptedOutput}</pre>

                <!-- Buttons cpy / name file / dl + Format -->
                <div
                    align="center"
                    style="padding-bottom: 1vh; display: flex; justify-content: center; gap: 1rem; align-items: center; flex-wrap: wrap;"
                >
                    <Button
                        color="primary"
                        on:click={() => {
                            copyToClipboard("str");
                        }}>Copier</Button
                    >

                    <Input
                        type="text"
                        placeholder="Nom du fichier"
                        bind:value={filename}
                        style="max-width: 200px;"
                    />

                    <div
                        style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                        <label for="format-select">Format</label>
                        <select
                            id="format-select"
                            bind:value={selectedFormat}
                            style="border-radius: 0.5vh; padding: 0.4vh;"
                        >
                            <option value="txt">.txt</option>
                            <option value="csv">.csv</option>
                        </select>
                    </div>
                    <Button color="success" on:click={downloadEncryptedOutput}
                        >Télécharger</Button
                    >
                </div>
            </div>
        {/if}
    </main>
</div>

<style>
    /* Custom styles */
    #wrapper {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .main-container {
        height: 96vh;
        width: 96vw;
        padding: 2vh;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        border-radius: 1vh;
        box-shadow: 0 0 4vh rgba(0, 0, 0, 0.1);
    }

    .top-bar {
        display: flex;
        gap: 1rem;
        margin-bottom: 1vh;
    }

    .input-file {
        white-space: nowrap;
        border-radius: 1.2vh;
    }

    .highlight-progress {
        display: flex;
        align-items: center;
        font-size: 1rem;
        margin: 0.5vh 0 1vh 0;
        gap: 1rem;
    }

    .ascii-container {
        max-height: 40vh;
        flex: 1;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 1vh;
        padding: 1vh;
        border: 1px solid #ccc;
        background: rgba(209, 203, 203, 0.23);
        border-radius: 1vh;
    }

    .input-preview {
        margin-top: 1vh;
        padding: 1vh;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 0.5vh;
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .decimal-preview {
        margin-top: 1vh;
        padding: 1vh;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 0.5vh;
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-word;
    }

    .hex-preview {
        margin-top: 1vh;
        padding: 1vh;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 0.5vh;
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-word;
    }
</style>
