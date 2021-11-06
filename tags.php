<?php

if (!function_exists('str_starts_with')) {
    function str_starts_with ( $haystack, $needle ) {
        return strpos( $haystack , $needle ) === 0;
    }
}

$tags = [
    'black',
    'blue',
    'red',
    'yellow',
    'grey',
    'purple',
    'white',
    'green',
    
];

$possible_tags = [];
$search = $_GET['search'] ?? null;
$len = mb_strlen($search);
if ($search) {
    
    foreach($tags as $tag) {
        
        if(str_starts_with($tag, $search)) {
            $possible_tags[] = $tag;            
        } 
    }
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($possible_tags);