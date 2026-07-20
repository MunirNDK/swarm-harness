<?php
/**
 * wp-admin editing UI for the fields defined in field-schema.php.
 *
 * Plain WordPress `add_meta_box()` + a native `save_post` handler — not a
 * JetEngine Meta Box. Reads/writes the exact same meta keys
 * meta-fields.php registers for REST, so there's no separate storage
 * format to keep in sync and no risk of JetEngine's own field-naming
 * conventions silently diverging from what Next.js expects. To add a new
 * editable field, add it to field-schema.php — this file renders and
 * saves whatever that schema declares, nothing is hardcoded per-field here.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'add_meta_boxes', 'shi_add_meta_boxes' );
add_action( 'save_post', 'shi_save_meta_box_fields' );

function shi_add_meta_boxes() {
	foreach ( array( 'service', 'service_area' ) as $post_type ) {
		add_meta_box(
			'shi_fields_' . $post_type,
			'Headless Content Fields',
			'shi_render_meta_box',
			$post_type,
			'normal',
			'high'
		);
	}
}

function shi_render_meta_box( $post ) {
	wp_nonce_field( 'shi_save_fields', 'shi_fields_nonce' );
	$schema = shi_field_schema( $post->post_type );

	echo '<style>
		.shi-field { margin-bottom: 18px; }
		.shi-field > label { display: block; font-weight: 600; margin-bottom: 4px; }
		.shi-field .description { color: #666; font-size: 12px; margin-top: 4px; }
		.shi-field input[type=text], .shi-field textarea { width: 100%; max-width: 640px; }
		.shi-repeater-row { display: flex; gap: 8px; margin-bottom: 6px; align-items: flex-start; }
		.shi-repeater-row input, .shi-repeater-row textarea { flex: 1; }
		.shi-repeater-row .shi-remove-row { flex: 0 0 auto; }
		.shi-object-row { border: 1px solid #dcdcde; padding: 10px; margin-bottom: 8px; border-radius: 4px; }
		.shi-object-row .shi-subfield { margin-bottom: 6px; }
		.shi-object-row .shi-subfield label { display: block; font-size: 12px; color: #555; margin-bottom: 2px; }
	</style>';

	foreach ( $schema as $field ) {
		echo '<div class="shi-field">';
		echo '<label>' . esc_html( $field['label'] ) . '</label>';

		if ( 'text' === $field['type'] ) {
			$value = get_post_meta( $post->ID, $field['key'], true );
			echo '<input type="text" name="shi_meta[' . esc_attr( $field['key'] ) . ']" value="' . esc_attr( $value ) . '" />';
		} elseif ( 'textarea' === $field['type'] ) {
			$value = get_post_meta( $post->ID, $field['key'], true );
			echo '<textarea name="shi_meta[' . esc_attr( $field['key'] ) . ']" rows="4">' . esc_textarea( $value ) . '</textarea>';
		} elseif ( 'repeater_strings' === $field['type'] ) {
			shi_render_repeater_strings( $field, (array) get_post_meta( $post->ID, $field['key'], true ) );
		} elseif ( 'repeater_object' === $field['type'] ) {
			shi_render_repeater_object( $field, (array) get_post_meta( $post->ID, $field['key'], true ) );
		}

		if ( ! empty( $field['help'] ) ) {
			echo '<p class="description">' . esc_html( $field['help'] ) . '</p>';
		}
		echo '</div>';
	}

	shi_render_repeater_js();
}

function shi_render_repeater_strings( $field, $values ) {
	$key = esc_attr( $field['key'] );
	echo '<div class="shi-repeater" data-key="' . $key . '" data-kind="strings">';
	echo '<div class="shi-repeater-rows">';
	if ( empty( $values ) ) {
		$values = array( '' );
	}
	foreach ( $values as $value ) {
		echo '<div class="shi-repeater-row">';
		echo '<input type="text" name="shi_meta[' . $key . '][]" value="' . esc_attr( $value ) . '" />';
		echo '<button type="button" class="button shi-remove-row">Remove</button>';
		echo '</div>';
	}
	echo '</div>';
	echo '<button type="button" class="button shi-add-row">Add ' . esc_html( $field['label'] ) . '</button>';
	echo '</div>';
}

function shi_render_repeater_object( $field, $rows ) {
	$key = esc_attr( $field['key'] );
	echo '<div class="shi-repeater" data-key="' . $key . '" data-kind="object">';
	echo '<div class="shi-repeater-rows">';
	if ( empty( $rows ) ) {
		$rows = array( array() );
	}
	foreach ( $rows as $i => $row ) {
		shi_render_object_row( $key, $field['subfields'], $row );
	}
	echo '</div>';
	echo '<button type="button" class="button shi-add-object-row" data-key="' . $key . '">Add ' . esc_html( $field['label'] ) . '</button>';
	echo '</div>';

	// Hidden template for JS to clone when adding a new row.
	echo '<template class="shi-object-row-template" data-key="' . $key . '">';
	shi_render_object_row( $key, $field['subfields'], array(), '__INDEX__' );
	echo '</template>';
}

function shi_render_object_row( $key, $subfields, $row, $index = null ) {
	echo '<div class="shi-object-row">';
	foreach ( $subfields as $sub ) {
		$value = $row[ $sub['key'] ] ?? '';
		$name  = 'shi_meta[' . $key . '][' . ( null === $index ? '' : $index ) . '][' . esc_attr( $sub['key'] ) . ']';
		echo '<div class="shi-subfield"><label>' . esc_html( $sub['label'] ) . '</label>';
		if ( 'textarea' === $sub['type'] ) {
			echo '<textarea name="' . $name . '" rows="2">' . esc_textarea( $value ) . '</textarea>';
		} else {
			echo '<input type="text" name="' . $name . '" value="' . esc_attr( $value ) . '" />';
		}
		echo '</div>';
	}
	echo '<button type="button" class="button shi-remove-row">Remove</button>';
	echo '</div>';
}

function shi_render_repeater_js() {
	?>
	<script>
	(function () {
		document.querySelectorAll('.shi-repeater').forEach(function (repeater) {
			var kind = repeater.dataset.kind;
			var key = repeater.dataset.key;
			var rows = repeater.querySelector('.shi-repeater-rows');
			var addBtn = repeater.querySelector('.shi-add-row, .shi-add-object-row');

			if (addBtn && kind === 'strings') {
				addBtn.addEventListener('click', function () {
					var row = document.createElement('div');
					row.className = 'shi-repeater-row';
					row.innerHTML = '<input type="text" name="shi_meta[' + key + '][]" value="" />' +
						'<button type="button" class="button shi-remove-row">Remove</button>';
					rows.appendChild(row);
				});
			}

			if (addBtn && kind === 'object') {
				addBtn.addEventListener('click', function () {
					var tpl = repeater.parentElement.querySelector('.shi-object-row-template[data-key="' + key + '"]');
					var index = rows.children.length;
					var html = tpl.innerHTML.split('__INDEX__').join(String(index));
					var wrapper = document.createElement('div');
					wrapper.innerHTML = html.trim();
					rows.appendChild(wrapper.firstChild);
				});
			}

			repeater.addEventListener('click', function (e) {
				if (e.target.classList.contains('shi-remove-row')) {
					e.target.closest('.shi-repeater-row, .shi-object-row').remove();
				}
			});
		});
	})();
	</script>
	<?php
}

function shi_save_meta_box_fields( $post_id ) {
	if ( ! isset( $_POST['shi_fields_nonce'] ) || ! wp_verify_nonce( $_POST['shi_fields_nonce'], 'shi_save_fields' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$post_type = get_post_type( $post_id );
	$schema    = shi_field_schema( $post_type );
	if ( empty( $schema ) ) {
		return;
	}

	$submitted = $_POST['shi_meta'] ?? array();

	foreach ( $schema as $field ) {
		$key = $field['key'];

		if ( 'text' === $field['type'] ) {
			update_post_meta( $post_id, $key, sanitize_text_field( $submitted[ $key ] ?? '' ) );
		} elseif ( 'textarea' === $field['type'] ) {
			update_post_meta( $post_id, $key, sanitize_textarea_field( $submitted[ $key ] ?? '' ) );
		} elseif ( 'repeater_strings' === $field['type'] ) {
			$rows = array_filter( array_map( 'sanitize_text_field', (array) ( $submitted[ $key ] ?? array() ) ), function ( $v ) {
				return '' !== $v;
			} );
			update_post_meta( $post_id, $key, array_values( $rows ) );
		} elseif ( 'repeater_object' === $field['type'] ) {
			$rows   = array();
			$raw    = (array) ( $submitted[ $key ] ?? array() );
			foreach ( $raw as $raw_row ) {
				$row       = array();
				$has_value = false;
				foreach ( $field['subfields'] as $sub ) {
					$val = $raw_row[ $sub['key'] ] ?? '';
					$val = 'textarea' === $sub['type'] ? sanitize_textarea_field( $val ) : sanitize_text_field( $val );
					if ( '' !== $val ) {
						$has_value = true;
					}
					$row[ $sub['key'] ] = $val;
				}
				if ( $has_value ) {
					$rows[] = $row;
				}
			}
			update_post_meta( $post_id, $key, $rows );
		}
	}
}
