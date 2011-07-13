package TypefaceJS;
use strict;

=head1 NAME

TypefaceJS - Generate fonts for use with typeface.js

=head1 SYNOPSIS

use TypefaceJS;

my $typeface = TypefaceJS::new->( 
	input_filename => "truetype_font.ttf",
	unicode_range_names => ['Basic Latin', 'Latin-1 Supplement'],
);

$typeface->write_file( output_filename => 'font.typeface.js' );

=head1 DESCRIPTION

TypefaceJS converts truetype fonts to a format that typeface.js can read.  typeface.js is
a javascript library that uses web browsers' vector drawing capability (<canvas> and VML) to 
draw text in HTML documents. See http://typeface.neocracy.org.  

Many font vendors specifically prohibit embedding fonts in documents, and this module attempts 
to honor those restrictions.  

=head1 METHODS

Methods take named parameters.

=item new()

Takes an C<input_filename> which should be a truetype font file, and optional arrayref of 
C<unicode_range_names> to support.  If no range names are specified it is assumed we want all 
that are supported by the font.  See F<Unicode::UCD>.

=item check_embed_license()

Checks to see whether the vendor indicated that this font should be embedable as indicated by
the fsType value in the font's OS/2 table.  Returns false if any level of restriction is set at 
all.  See page 86 the spec: http://www.microsoft.com/typography/tt/ttf_spec/ttch02.doc

=item get_unicode_range_counts()

Returns a hashref containing information about which characters and which unicode ranges are 
supported within this font.  See F<Unicode::UCD>.

=item get_json_data()

Returns the JSON data structure used by typeface.js.  This contains glyph outline information as selected font metadata.

=item write_file()

Writes the font in typeface.js format, using javascript and JSON.  Takes an optional C<output_filename>
parameter which defaults to a reasonable name if not specified.

=head1 AUTHOR

David Chester | davidchester@gmx.net

=head1 COPYRIGHT

Copyright (c) 2008, David Chester

This program is free software; you can redistribute
it and/or modify it under the same terms as Perl itself.

The full text of the license can be found in the
LICENSE file included with this module.


=head1 SEE ALSO

F<Font::Freetype>, F<Font::TTF::Font>, F<Unicode::UCD>

=cut

use Font::FreeType;
use Font::TTF::Font;
use JSON::XS;

use Unicode::UCD;

sub new {
	
	my $self = shift;
	my %args = @_;

	die "couldn't find filename: $args{input_filename}" unless -e $args{input_filename};

	my $truetype_font = Font::TTF::Font->open($args{input_filename}) || die "couldn't load font: $args{input_filename}";

	$truetype_font->{'OS/2'}->read;
	$truetype_font->{'name'}->read;

	my $freetype = Font::FreeType->new;
	my $freetype_face = $freetype->face($args{input_filename}, options => FT_LOAD_NO_HINTING);

	my $family_name = $freetype_face->family_name;
	my $font_style = $freetype_face->style_name;

	(my $output_filename = lc "${family_name}_$font_style.typeface.js") =~ s/\s+/_/g;
	
	my $charblocks = Unicode::UCD::charblocks;
	my %export_unicode_range_names = map { $_ => 1 } @{ $args{export_unicode_range_names} || [ keys %{ $charblocks } ] };

	my %export_subset_characters = map { $_ => 1 } split '', $args{export_subset_characters};

	$self = {
		input_filename => $args{input_filename},
		truetype_font => $truetype_font,
		freetype_face => $freetype_face,
		family_name => $family_name,
		font_style => $font_style,
		output_filename => $output_filename,
		unicode_ranges => {},
		export_unicode_range_names => \%export_unicode_range_names,
		export_subset_characters => \%export_subset_characters
	};

	bless $self;
	$self->_convert_font;
	return $self;
}

sub check_embed_license {
	
	my $self = shift;

	my $truetype_font = $self->{truetype_font};	

	# if the vendor for this font has indicated that the font should not be embedable, return false
	if (!defined $truetype_font->{'OS/2'}->{fsType} || $truetype_font->{'OS/2'}->{fsType} != 0) {
		return 0;
	}

	return 1;
}

sub get_json_data {
	my $self = shift;
	return $self->{typeface_data};
}

sub get_unicode_range_counts {
	my $self = shift;
	return $self->{unicode_range_counts};
}

sub write_file {

	my $self = shift;
	my %args = @_;

	my $output_filename = $args{output_filename} || $self->{output_filename};

	open F, ">$output_filename";
	print F $self->{typeface_data};
	close F;

	print "wrote $output_filename\n";

}

sub _convert_font {

	my $self = shift;

	return unless $self->{font_embedable} = $self->check_embed_license;

	my $face = $self->{freetype_face};

	my $resolution = 1000;

	# load font at 100pt, $resolution dpi;
	$face->set_char_size(100, 100, $resolution, $resolution);

	# http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&item_id=IWS-Chapter08#3054f18b
	my @ttf_name_table_names = qw(
		copyright
		font_family_name
		font_sub_family_name 
		unique_font_identifier
		full_font_name
		version_string
		postscript_name
		trademark
		manufacturer_name
		designer
		description
		vendor_url
		designer_url
		license_description
		license_url
	);

	my $original_name_table;
	my $index = 0;
	for my $key (@ttf_name_table_names) {
		$original_name_table->{$key} = $self->{truetype_font}->{name}->find_name($index++);
	}

	my $typeface = {
		lineHeight => $face->height,
		ascender => $face->ascender,
		descender => $face->descender,
		familyName => $self->{family_name},
		resolution => $resolution,
		cssFontStyle => $face->is_italic ? 'italic' : 'normal',
		cssFontWeight => $face->is_bold ? 'bold' : 'normal',
		underlineThickness => $face->underline_thickness,
		underlinePosition => $face->underline_position,
		original_font_information => $original_name_table,
	};

	my $unicode_range_counts;

	$face->foreach_char( sub {

		my $glyph = $_;
		my $character = chr($glyph->char_code);

		my $unicode_range_name = Unicode::UCD::charblock($glyph->char_code);
		my $unicode_range = $self->{unicode_ranges}->{ $unicode_range_name || 'Miscelaneous' };

		$unicode_range->{count}++;
		$self->{unicode_ranges}->{$unicode_range_name}->{parsed} = 1;
		push @{ $unicode_range->{characters} }, $character;

		return unless $self->{export_unicode_range_names}->{$unicode_range_name};
		
		if (
			keys %{ $self->{export_subset_characters} } 
			&& ! $self->{export_subset_characters}->{ $character } 
		) {
			return;
		}

		$typeface->{glyphs}->{$character}->{ha} = $glyph->horizontal_advance;

		my $bbox;
		($bbox->{xMin}, $bbox->{yMin}, $bbox->{xMax}, $bbox->{yMax}) = $glyph->outline_bbox();

		# d is for dimension
		for my $d qw(xMax yMax) {
			$typeface->{boundingBox}->{$d} ||= $bbox->{$d} || 0;
			$typeface->{boundingBox}->{$d} = 
				($bbox->{$d} > $typeface->{boundingBox}->{$d}) ? 
					$bbox->{$d} : 
					$typeface->{boundingBox}->{$d};
		}

		for my $d qw(xMin yMin) {
			$typeface->{boundingBox}->{$d} ||= $bbox->{$d} || 0;
			$typeface->{boundingBox}->{$d} = 
				($bbox->{$d} < $typeface->{boundingBox}->{$d}) ? 
					$bbox->{$d} : 
					$typeface->{boundingBox}->{$d};
		}

		$glyph->outline_decompose(
			move_to => sub { $typeface->{glyphs}->{$character}->{o} .= join ' ', 'm', (map { sprintf "%d", $_ } @_), '' },
			line_to => sub { $typeface->{glyphs}->{$character}->{o} .= join ' ', 'l', (map { sprintf "%d", $_ } @_), '' },
			conic_to => sub { $typeface->{glyphs}->{$character}->{o} .= join ' ', 'q', (map { sprintf "%d", $_ } @_), '' },
			cubic_to => sub { $typeface->{glyphs}->{$character}->{o} .= join ' ', 'b', (map { sprintf "%d", $_ } @_), '' },
		);

	} );

	$self->{typeface_data} = qq[if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace(] . encode_json($typeface) . ');';

	$self->{unicode_range_counts} = $unicode_range_counts;
}

1;

