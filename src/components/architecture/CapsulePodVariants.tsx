import { CapsulePodHaven, type CapsulePodHavenProps, type CapsulePodStyle } from './CapsulePodHaven';

export type CapsulePodDesign = CapsulePodStyle;
type Props = CapsulePodHavenProps & { design: Exclude<CapsulePodDesign, 'original'> };

/** A and B are material studies of the production pod: every existing path,
 * component, anchor and interaction is drawn by CapsulePodHaven itself. */
export function CapsulePodVariant({ design, ...props }: Props) {
  return <CapsulePodHaven {...props} design={design} />;
}
