/* =============================================================================
   IMAGE MAP — the only file you edit when new renders arrive.

   Put the files in assets/img/ and write their paths here. Anything left as ""
   renders a labelled dashed placeholder, so the site is always shippable with
   however many images actually exist.

   The eight archetypes take three portraits each, in this order:
       [0] textbook   — the pure form of the type
       [1] variation  — recognisably the type, one thing off-spec
       [2] edge case  — barely qualifies, stretched to the edge

   Which one shows is not random: it comes from how far the user's answers sit
   from the archetype's centre, split at that type's distance terciles. Each of
   the three comes up almost exactly a third of the time. See PROMPTS.md in
   assets/img/ for the generation brief behind every slot.

   build.js swaps every path below for an inline data: URI when it builds the
   single-file version, so keep the paths relative to the site root.
   ============================================================================= */
window.WZ_IMG = {

  /* ---- interstitials ---- */
  scared  : "assets/img/scared.webp",   // GET YOUR SHIT TOGETHER
  obese   : "assets/img/obese.webp",   // then lose the weight, bro
  ugly    : "assets/img/ugly.webp",   // which spell did he use
  gay     : "assets/img/gay.webp",   // why are you gay
  gay2    : "assets/img/gay2.webp",   // seriously dude, why are you gay
  homo    : "assets/img/homo.webp",   // FindMeAHomo app listing
  cops    : "assets/img/cops.webp",   // pedo detected, calling the cops
  complex : "",   // got some complexes there

  /* ---- archetypes: [textbook, variation, edge case] ---- */
  model        : ["assets/img/model1.webp", "assets/img/model2.webp", "assets/img/model3.webp"],
  gothic       : ["assets/img/gothic1.webp", "assets/img/gothic2.webp", "assets/img/gothic3.webp"],
  litigator    : ["assets/img/litigator1.webp", "assets/img/litigator2.webp", "assets/img/litigator3.webp"],
  nerd         : ["assets/img/nerd1.webp", "assets/img/nerd2.webp", "assets/img/nerd3.webp"],
  girlnextdoor : ["assets/img/girlnextdoor1.webp", "assets/img/girlnextdoor2.webp", "assets/img/girlnextdoor3.webp"],
  baddie       : ["assets/img/baddie1.webp", "assets/img/baddie2.webp", "assets/img/baddie3.webp"],
  valkyrie     : ["assets/img/valkyrie1.webp", "assets/img/valkyrie2.webp", "assets/img/valkyrie3.webp"],
  comfort      : ["assets/img/comfort1.webp", "assets/img/comfort2.webp", "assets/img/comfort3.webp"]
};
