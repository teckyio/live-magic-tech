<h1>post list</h1>
<?php
$result = mysqli_query($conn, "select * from fb_post");
foreach ($result as $row) {
	$id = $post['id'];
	$title = $post['title'];
	echo "<div>#$id: $titile</div>";
}
?>