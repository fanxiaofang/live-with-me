// Additional NW back-left quarter only; original four-view assets stay independent.
// Coordinates are in the approved head plane, before the fixed +10.875 translation.
// `back` is exclusively far hair hidden by the face. `front` contains the visible
// occipital surface FIRST, then near locks. Rear-of-skull does not mean behind skin.
export const hairstyles = [
  {id:'shorthair', label:'经典短发', original:'shorthair'},
  {id:'curly', label:'层叠长卷发', original:'curly'},
  {id:'sidepart', label:'偏分低束发', original:'sidepart'},
  {id:'shaggy', label:'双色蓬松碎发', original:'shaggy'},
];

export function hairParts(id, reference, prefix) {
  if(id==='shorthair') return {back:'', front:`<g data-hair="classic-short"><path d="${reference.layers.shortHair.d}" fill="url(#${prefix}-short-hair)"/></g>`};
  const curlFill='fill="#57483d" stroke="#30261f" stroke-opacity=".34" stroke-width="4.5" stroke-linejoin="round"';
  const curlLine='fill="none" stroke="#30261f" stroke-opacity=".3" stroke-width="6" stroke-linecap="round"';
  if(id==='curly') return {
    back:'',
    front:`<g data-hair="curly" data-revision="4">
      <g data-hair-layer="occipital-and-lengths" ${curlFill}>
        <!-- The right edge is the far rear turn: narrower, shorter outward curls. -->
        <path d="M529,440 C592,450 660,460 708,467
          C708,507 729,537 760,550 C739,559 714,546 704,530
          C707,578 734,602 770,615 C746,627 713,608 699,588
          C709,636 731,663 759,681 C735,689 711,680 693,663
          C703,707 716,735 739,761 C704,763 676,746 661,723
          C648,748 650,781 667,807 C636,802 614,782 605,752
          C607,780 598,807 582,827 C565,803 558,777 563,751
          Q551,770 539,774 C549,753 552,731 543,714
          C533,741 514,758 491,761 C504,737 507,708 500,681
          C494,659 492,638 501,616 C509,595 520,580 519,555
          C518,525 505,496 510,458Z"/>
      </g>
      <!-- Sparse, separated turns as in the four views. No duplicate closed
           lock outlines running parallel down the left side. -->
      <g data-hair-layer="strand-turns" ${curlLine}>
        <path d="M567,513 C581,550 562,588 550,617
          M659,519 C646,555 657,591 680,610
          M613,670 C618,703 599,729 594,754"/>
      </g>
      <g data-hair-layer="near-temple-inward-curl" ${curlFill}>
        <!-- Root starts above the brim; two inward turns overlap the back locks. -->
        <path d="M487,441 C477,476 496,501 486,531
          C480,550 464,566 444,575 C474,577 497,561 506,542
          C505,575 487,603 461,617 C495,619 523,596 532,562
          C542,527 524,492 528,457Z"/>
      </g>
      <g data-hair-layer="short-side-fringe" fill="#57483d" stroke="#30261f" stroke-opacity=".28" stroke-width="3" stroke-linejoin="round">
        <!-- Three tapered wisps: a small front curl and two separated temple
             tips, with clear gaps before the long cheek lock. No inner lines. -->
        <path d="M361,389 C357,407 360,419 370,426
          C366,415 369,407 375,401 L378,397Z"/>
        <path d="M429,420 C424,437 429,453 442,462
          C436,449 437,440 443,434 L449,433Z"/>
        <path d="M463,436 C459,450 463,464 474,472
          C470,460 470,453 478,446Z"/>
      </g>
    </g>`
  };
  if(id==='sidepart') return sidepart();
  if(id==='shaggy') return shaggy();
  throw new Error(`Unknown NW hairstyle: ${id}`);
}

function sidepart() {
  const fill='fill="#b8afa0" stroke="#756b5e" stroke-opacity=".42" stroke-width="4.5" stroke-linejoin="round"';
  const line='fill="none" stroke="#756b5e" stroke-opacity=".38" stroke-width="5.5" stroke-linecap="round"';
  return {
    // The original left profile is the tucked side. The long RIGHT-temple lock
    // is on the far side here, so the unmodified face must occlude its root.
    back:`<g data-hair="sidepart-far-long-lock" data-hair-layer="far" ${fill}>
      <!-- The far right-temple root recedes behind the face in this back-left
           view. Only its narrow lower contour is visible; no forehead curtain. -->
      <path d="M415,410 C381,451 400,500 421,537
        C428,558 434,581 447,599 C441,569 445,544 456,518
        C434,483 424,448 441,426Z"/>
      <path d="M414,510 Q421,553 437,578" ${line}/>
    </g>`,
    front:`<g data-hair="sidepart" data-revision="3">
      <!-- One continuous cap wraps the visible back of the skull and gathers
           inward to the nape, instead of a strip at the outer right edge. -->
      <g data-hair-layer="occipital-gather" ${fill}>
        <path d="M480,433 C548,452 648,465 709,467
          C716,503 704,542 683,568 C665,590 646,599 628,608
          C611,614 595,607 582,601 C558,600 539,589 525,574
          Q534,577 541,575 C520,556 514,538 512,521
          C506,493 491,468 480,433Z"/>
        <!-- Tail begins at the same nape anchor; single mass, single end. -->
        <path d="M615,603 C596,626 600,651 610,676
          C620,697 635,720 645,739 C644,715 661,694 656,669
          C653,641 634,624 638,606Z"/>
      </g>
      <g data-hair-layer="gather-lines" ${line}>
        <path d="M687,500 C688,541 663,577 643,592
          M555,490 C559,532 578,574 608,592
          M518,484 C529,506 533,526 536,542
          M620,510 C610,547 615,571 622,587
          M618,634 C613,668 632,687 638,715"/>
      </g>
      <ellipse data-low-tie="true" cx="625" cy="608" rx="23" ry="10" transform="rotate(9 625 608)" fill="#694b3b"/>
    </g>`
  };
}

function shaggy() {
  const fill='fill="#e4c983" stroke="#927847" stroke-opacity=".38" stroke-width="4" stroke-linejoin="round"';
  return {
    back:'',
    front:`<g data-hair="shaggy" data-revision="3">
      <!-- Dark nape wraps the rear skull, and is not a second fringe on the face. -->
      <path data-hair-layer="dark-nape" fill="#25221f" d="M500,454 L708,467
        C720,501 710,535 702,550 Q708,565 721,577
        L690,566 L693,594 Q677,586 663,572
        L655,609 Q639,592 632,582 L614,606 L606,579
        Q589,596 578,598 L580,572 L557,578 L561,550
        Q531,547 517,524 C504,503 500,475 500,454Z"/>
      <!-- Fewer, larger feathered clumps. Front/temple strands descend, while
           the rear layers turn sideways around the skull and over the nape. -->
      <path data-hair-layer="light-feathered-volume" ${fill} d="M341,365
        C414,403 555,454 716,465 C718,489 734,507 752,514
        C730,521 709,510 697,500 Q703,526 731,547
        C707,547 686,536 672,518 C674,542 683,560 698,572
        C675,565 656,549 647,533 Q648,562 636,581
        C620,569 613,547 609,529 C603,550 588,567 568,575
        Q576,548 563,516 C546,533 532,538 520,539
        L529,511 Q531,497 524,482 C518,519 501,545 478,554
        C488,522 482,496 470,477 Q458,498 439,503
        L448,477 C452,466 447,455 442,446
        C429,476 407,493 384,497 C397,470 399,447 391,431
        Q374,453 352,457 L363,432 Q338,445 319,440
        C337,426 346,414 341,400 Q327,415 309,417
        C331,400 337,381 341,365Z"/>
      <g data-hair-layer="sparse-strand-turns" fill="none" stroke="#927847" stroke-opacity=".3" stroke-width="4.5" stroke-linecap="round">
        <path d="M421,439 Q420,465 402,477
          M502,470 Q507,506 492,531
          M621,501 Q621,538 631,557
          M685,498 Q692,520 709,531"/>
      </g>
    </g>`
  };
}
