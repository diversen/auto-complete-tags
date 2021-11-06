# Auto complete tags

A custom HTML element that let's a user auto-complete-tags fetching data from a URL: 

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