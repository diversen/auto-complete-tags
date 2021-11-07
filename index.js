class AutoCompleteTags extends HTMLElement {

    attributeChangedCallback() { }

    /**
     * Called when element is created
     */
    constructor() {
        super()
    }

    /**
     * Called after the element is attached to the DOM
     */
    connectedCallback() {

        const name = this.getAttribute("name")
        this.innerHTML = `
			<input name="${name}" type="text" class="enter" value="">
			<div class="suggest"></div>
		`

        this.enter = this.querySelector('.enter');
        this.suggest = this.querySelector('.suggest')
        this.loadedTags = []

        // read from auto-complete data-url
        const suggestUrl = this.dataset.url;

        // function for fetching suggestions
        async function loadTags(search) {
            const response = await fetch(suggestUrl + search);
            const names = await response.json();
            return names
        }

        // Default wait time before autocomplete tries to load tags from URL
        let waitTime = 500;
        if (this.dataset.wait) {
            waitTime = this.dataset.wait;
        }

        let completeKeys = ['Enter']
        if (this.dataset.completeKeys) {
            completeKeys = this.dataset.completeKeys.split(',');
        }

        // Read from auto-complete value
        this.enter.value = this.getAttribute('value');
        this.skipLoadTags = false;

        this.enter.addEventListener('keydown', async (e) => {

            // Get selected from drop down list
            if (completeKeys.includes(e.key)) {
                this.setSelectedTag()
                this.skipLoadTags = true;
                e.preventDefault();
            }

            // Prevent moving to start of input field
            if (e.key == 'ArrowUp') {
                e.preventDefault();
            }
        })

        // The current position in the input list
        let position = -1;
        let timer = null;

        this.enter.addEventListener("keyup", async (e) => {

            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {

                e.preventDefault()

                const suggestions = document.querySelectorAll('.suggest > div');
                const num_elems = suggestions.length;

                for (let i = 0; i < num_elems; i++) {
                    suggestions[i].classList.remove('selected');
                }

                if (e.key === 'ArrowDown' && position < num_elems - 1) {
                    position += 1;
                }

                if (e.key === 'ArrowUp' && position > -1) {
                    position -= 1;
                }

                if (position >= 0) {
                    let current = suggestions[position]
                    current.classList.add('selected')
                }
            } else {

                // Build suggestion drop down
                position = -1;
                let current = this.getCurrentInput()

                if (this.skipLoadTags) {
                    current = ''
                }

                clearTimeout(timer);
                timer = setTimeout(async () => {
                    this.loadedTags = await loadTags(current)
                    this.buildTagsList()
                    this.skipLoadTags = false;
                }, waitTime);
            }
        }, false);

        this.enter.addEventListener('blur', (e) => {
            // If no related target then we are not on this.enter element anymore.
            // Then clear dropdown list
            if(e.relatedTarget) {
                this.suggest.innerHTML = ``;
            }
        })
    }

    /**
     * Get selected tag from dropdown
     */
    setSelectedTag() {
        let selectedTag = this.getSelectedTag();
        // If not selected then the value is manually input

        if (!selectedTag) {
            selectedTag = this.getCurrentInput();
        }

        let allTags = this.getAllTags();
        allTags.pop();
        allTags.push(selectedTag)

        this.setTagsString(allTags)

    }

    setTagsString(allTags) {

        allTags = allTags.map(val => val.trim())
        allTags = Array.from(new Set(allTags));

        this.enter.value = allTags.join(', ')
        if (this.enter.value !== '') {
            this.enter.value += ', '
        }
    }

    deleteTag() {

        let allTags = this.getAllTags();
        allTags.pop();
        this.setTagsString(allTags)
    }

    getSelectedTag() {
        const elem_selected = this.querySelector('.selected');
        if (elem_selected) {
            return elem_selected.innerHTML;
        }
    }

    getAllTags() {
        let value = this.enter.value
        let allTags = value.split(',')

        allTags = allTags.filter((val) => {
            if (val.trim() !== '') {
                return true
            }
        })

        allTags = allTags.map(val => val.trim())
        return allTags;
    }


    getCurrentInput() {

        let enteredTags = this.getAllTags();
        let current = enteredTags.pop();
        if (!current) {
            current = '';
        }
        return current.trim();
    }

    buildTagsList() {

        this.suggest.innerHTML = ``;
        this.loadedTags.forEach((title) => {
            const li = document.createElement("div");
            li.appendChild(document.createTextNode(title));
            li.addEventListener('click', (e) => {
                li.classList.add('selected');
                this.setSelectedTag();
                this.enter.focus();
                this.suggest.innerHTML = '';
            })

            this.suggest.appendChild(li);
        })
    }
}

export { AutoCompleteTags }
