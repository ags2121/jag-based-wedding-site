let db = [
	{'name': 'about', 'type': '1text_1photo', 'text1': 'I am JAG', 'photo1': 'jag.jpg'},
	{
		'name': 'narrative', 
		'type': 'tiered_text_video', 
		'media': [{
			'name': 'foo',
			'thumb': 'foo_thumb.jpg',
			'video': 'https://www.youtube.com/watch?v=WuX5p7OPpPU'
		}]
	},
	{
		'name': 'docs', 
		'type': 'tiered_text_video',
		'media': [{
			'name': 'foo',
			'thumb': 'foo_thumb.jpg',
			'video': 'https://www.youtube.com/watch?v=WuX5p7OPpPU'
		}]
	},
	{
		'name': 'stills', 
		'type': 'photo',
		'media': [{
			'name': 'foo',
			'thumb': 'foo_thumb.jpg',
			'large': 'foo.jpg'
		}]
	},
	{'name': 'contact', 'type': '1text', 'text1': 'JAG@JAG.com'}
];
