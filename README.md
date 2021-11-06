# Auto complete tags

A custom HTML element that will fetch `tag` suggestions from an endpoint: 

~~~html
    <form method="post" action="/post.php">
		<auto-complete-tags
			data-wait="500" 
			data-url="/tags.php?search=" 
			data-complete-keys="Enter"
			name="tags" 
			value="grey, blue, ">
		</auto-complete-tags>
		<input type="submit" name="submit" value="send" />
	</form>
	<script type="module">

		import {AutoCompleteTags} from '/index.js';
		customElements.define('auto-complete-tags', AutoCompleteTags);

	</script>

~~~

`data-wait` specifies how many milli-seconds to wait before fetching data from the endpoint

`data-url` is the endpoint. This should return a JSON array which will build the dropdown selection list.

`data-complete-keys` is the keys that will auto-complete the selection. `ArrowUp` and `ArrowDown` are used for moving up and down.

