class AutoCompleteTags extends HTMLElement {

	attributeChangedCallback() {
		console.log('something happend');
	}

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

		console.log('connected')
		const name = this.getAttribute("name")
		this.innerHTML = `
			<span class="entered"></span>
			<input name="${name}" type="text" class="enter" value="">
			<div class="suggest"></div>
		`

		this.enter = this.querySelector('.enter');
		this.suggest = this.querySelector('.suggest')
		this.entered = this.querySelector('.entered');
		this.loadedTags = []

		// read from auto-complete data-url
		const suggest_url = this.dataset.url;

		// function for fetching suggestions
		async function loadTags(search) {
			const response = await fetch(suggest_url + search);
			const names = await response.json();
			return names
		}

		// Default wait time before autocomplete tries to load tags from URL
		let wait_time = 500;
		if (this.dataset.wait){
			wait_time = this.dataset.wait;
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
       			timer = setTimeout( async () => {
					this.loadedTags = await loadTags(current)
					this.buildTagsList()
					this.skipLoadTags = false;
				}, wait_time)
				
					
			}
		}, false);
	}

	/**
	 * Get selected tag from dropdown
	 */
	setSelectedTag() {
		let selected_tag = this.getSelectedTag();
		// If not selected then the value is manually input
		
		if (!selected_tag) {
			selected_tag = this.getCurrentInput();
		}

		let all_tags = this.getAllTags();
		all_tags.pop();
		all_tags.push(selected_tag)

		this.setTagsString(all_tags)
		
	}

	setTagsString(all_tags) {

		all_tags = all_tags.map( val => val.trim())
		all_tags = Array.from(new Set(all_tags));
		
		this.enter.value = all_tags.join(', ')
		if (this.enter.value !== '') {
			this.enter.value += ', '
		}
	}

	deleteTag() {

		let all_tags = this.getAllTags();
		all_tags.pop();
		this.setTagsString(all_tags)
	}

	getSelectedTag() {
		const elem_selected = this.querySelector('.selected');
		if (elem_selected) {
			return elem_selected.innerHTML;
		}
	}

	getAllTags() {
		let value = this.enter.value
		let all_tags = value.split(',')
		
		all_tags = all_tags.filter( (val) => {
			if (val.trim() !== '') {
				return true
			}
		})

		all_tags = all_tags.map( val => val.trim())
		return all_tags;
	}


	getCurrentInput() {
		
		let entered_tags = this.getAllTags();
		let current = entered_tags.pop();
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
			li.addEventListener('click', function (e) {
				// Maybe allow click add at some time
			})
			this.suggest.appendChild(li);
		})
	}
}

export { AutoCompleteTags }
