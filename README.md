# Auto complete tags

A custom web component that will fetch `tag` suggestions from an endpoint: 

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

    import {AutoCompleteTags} from 'https://unpkg.com/auto-complete-tags@1.0.0/index.js';
    customElements.define('auto-complete-tags', AutoCompleteTags);

</script>

~~~

## Options

`data-wait` specifies how many milli-seconds to wait before fetching data from the endpoint

`data-url` is the endpoint. This should return a JSON array which will build the dropdown selection list.

Your current keyboard typings will be added to the `data-url` and sent to the endpoint

`data-complete-keys` is the keys that will auto-complete the selection. `ArrowUp` and `ArrowDown` are used for moving up and down.

## Styling

It is not using shadow-DOM so you can just style it using a normal stylesheet. 

## Demo

See: [index.html](index.html)

You can see the demo here [https://diversen.github.io/auto-complete-tags/](https://diversen.github.io/auto-complete-tags/)

## License

MIT © [Dennis Iversen](https://github.com/diversen)