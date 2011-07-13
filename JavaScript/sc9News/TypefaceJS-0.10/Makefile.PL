

use ExtUtils::MakeMaker;
# See lib/ExtUtils/MakeMaker.pm for details of how to influence
# the contents of the Makefile that is written.
WriteMakefile(
    NAME         => 'TypefaceJS',
    VERSION_FROM => 'lib/TypefaceJS.pm', # finds \$VERSION
    AUTHOR       => 'David Chester (davidchester@gmx.net)',
    ABSTRACT     => 'Generate fonts for use with typeface.js (http://typeface.neocracy.org)',
    PREREQ_PM    => {
                     'Test::Simple' => 0.44,
                    },
);
