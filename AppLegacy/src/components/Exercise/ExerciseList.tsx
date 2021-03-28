import { IonAvatar, IonButton, IonButtons, IonCheckbox, IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonModal, IonPage, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react'
import { arrowBack, checkmark, close, filter, key, searchOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import BackButton from '../BackButton'
import PopoverButton, { PopoverItem } from '../PopoverButton'
import { List } from 'react-virtualized'
import Exercise, { BodyParts, ExerciseCategories, ExerciseData, IExercise } from '../../data/models/Exercise'
import ExerciseItemThumbnail from './ExerciseItemThumb'
import Header from '../Header'
import AlertBox from '../../modals/Alert'
import Loader from '../../modals/Loader'
interface ExerciseListProps {
    asModal?: boolean,
    OnRequestDismiss?: () => void,
    selectable?: boolean,
    selectionMode?: 'single' | 'multi',
    OnSelectedExerciseListChange?: (exercises: IExercise[]) => void,
    selectedExercises?: IExercise[],
    show?: boolean
}

const Headerize = (sortedList: IExercise[]) => {
    let letter = "";
    let list: (IExercise & { header: false } | { title: string, header: boolean })[] = []
    for (let item of sortedList) {
        if (letter !== item.exerciseName[0]) {
            letter = item.exerciseName[0];
            list.push({ title: letter, header: true })
        }
        list.push({ ...item, header: false });
    }
    return list;
}
interface ExerciseListContextProps {
    selectable?: boolean,
    selectionMode?: 'single' | 'multi'
    selectedExercises: IExercise[],
    SetSelectedExercises: (exercises: IExercise[]) => void
}
const ExerciseListContext = React.createContext<ExerciseListContextProps>({
    selectable: false,
    selectionMode: "multi",
    selectedExercises: [],
    SetSelectedExercises: (exercises: IExercise[]) => { }
})
const useContext = () => React.useContext(ExerciseListContext);
const ExerciseList: React.FC<ExerciseListProps> = (props) => {
    const [exercises, SetExercises] = useState(Headerize(ExerciseData.data as IExercise[]));
    const [selectedExercises, SetSelectedExercises] = useState<IExercise[]>([]);
    const [searching, SetSearching] = useState(false)
    const [bodypartFilter, SetBodyPartFilter] = useState<string[]>([])
    const [categoriesFilter, SetCategoriesFilter] = useState<string[]>([])
    const [search, SetSearch] = useState('')
    useEffect(() => {
        if (props.OnSelectedExerciseListChange) {
            props.OnSelectedExerciseListChange(selectedExercises)
        }
    }, [selectedExercises])
    useEffect(() => {
        ApplyFilters()
    }, [search, bodypartFilter, categoriesFilter, ExerciseData.data])
    useEffect(() => {
        const OnExerciseDataChange = () => {
            ApplyFilters()
        }
        ExerciseData.events.on('change', OnExerciseDataChange)
        return () => {
            ExerciseData.events.off('change', OnExerciseDataChange)
        }
    }, [])
    const OnBack = (e: any) => {
        if (searching) {
            SetSearching(false);
            SetSearch("")
            return;
        }
        if (props.asModal && props.OnRequestDismiss) {
            props.OnRequestDismiss()
        } else {
            e.performDefault()
        }
    }
    const OnSearch = (query: string) => {
        if (query === "") {
            SetExercises(Headerize(ExerciseData.data as IExercise[]))
        } else {
            ApplyFilters()
        }
        SetSearch(query)
    }
    const ApplyFilters = () => {
        let x = ExerciseData.data.filter((ex) => {
            let tr = true;
            if (bodypartFilter.length > 0) {
                tr = tr && bodypartFilter.includes(ex.bodyPart)
            }
            if (categoriesFilter.length > 0) {
                tr = tr && categoriesFilter.includes(ex.category);
            }
            if (search !== '') {
                tr = tr && ex.exerciseName.toLowerCase().includes(search.toLowerCase())
            }
            return tr;
        })
        SetExercises(Headerize(x as IExercise[]));
    }
    const RowRenderer = (x: {
        key: any, // Unique key within array of rows
        index: any, // Index of row within collection
        style: any, // Style object to be applied to row (to position it)
    }) => {
        let { style, index, key } = x;
        let exercise = exercises[index]
        if (exercise.header) {
            return (
                <ExerciseListHeader key={key} style={style} title={exercise.title} />
            )
        } else {
            return (
                <ExerciseListItem key={key} style={style} exercise={exercise as IExercise} />
            );
        }
    }
    const SearchBar = <IonSearchbar defaultValue={search} onIonChange={e => OnSearch(e.detail.value || '')} mode='ios' />
    return (
        <ExerciseListContext.Provider value={{ selectable: props.selectable, selectionMode: props.selectionMode || 'multi', selectedExercises, SetSelectedExercises }}>
            <IonPage>
                <IonHeader className='ion-no-border'>
                    <IonToolbar>
                        <IonButtons slot='start'>
                            <BackButton OnClick={OnBack} />
                        </IonButtons>
                        {searching ? SearchBar : null}
                        <IonButtons slot='end'>
                            {searching ? null : <IonButton onClick={() => SetSearching(true)}><IonIcon icon={searchOutline} /></IonButton>}
                            <IonButton onClick={() => {
                                ExerciseListFilter.ref?.show({
                                    selectedBodyParts: bodypartFilter,
                                    selectedCategories: categoriesFilter
                                }).then((res) => {
                                    SetBodyPartFilter(res.selectedBodyParts);
                                    SetCategoriesFilter(res.selectedCategories)
                                })
                            }}><IonIcon icon={filter} /></IonButton>
                            {searching ? null : <PopoverButton>
                                <PopoverItem onClick={() => CreateExerciseModal.ref?.show()} button lines='none'>Create Exercise</PopoverItem>
                            </PopoverButton>}
                        </IonButtons>
                        {searching ? null : <IonTitle>Exercises</IonTitle>}
                    </IonToolbar>
                </IonHeader>
                <IonRow>

                </IonRow>
                <IonContent>

                    <List
                        width={window.innerWidth}
                        height={window.innerHeight}
                        rowCount={exercises.length}
                        rowHeight={56}
                        rowRenderer={RowRenderer}
                    />
                    {props.children}
                </IonContent>
            </IonPage>
            <ExerciseListFilter ref={ref => ExerciseListFilter.ref = ref} />
            <CreateExerciseModal ref={ref => CreateExerciseModal.ref = ref} />
        </ExerciseListContext.Provider>
    )
}

interface ExerciseListItemProps {
    exercise: IExercise,
    style: CSSStyleSheet
}
const ExerciseListItem: React.FC<ExerciseListItemProps> = (props) => {
    const router = useIonRouter()
    const exercise = props.exercise
    const { selectable, SetSelectedExercises, selectedExercises, selectionMode } = useContext()
    const checked = selectedExercises.some((e) => e._id === exercise._id)
    const OnIonChange = (add: boolean) => {
        if (add) {
            let x: IExercise[] = [];
            if (selectionMode === 'multi') {
                x = [...selectedExercises, exercise]
            } else {
                x = [exercise]
            }
            SetSelectedExercises(x);
        } else {
            SetSelectedExercises(selectedExercises.filter(e => e._id !== exercise._id))
        }
    }
    const OnItemClick = () => {
        if (!selectable) {
            router.push(`/exercise-info/${exercise._id}`)
        }
    }
    return (
        <IonItem onClick={!selectable ? OnItemClick : undefined} style={props.style} button={!selectable} lines='none'>
            <ExerciseItemThumbnail exercise={exercise} />
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <IonText style={{ fontSize: 12 }}>{exercise.exerciseName}</IonText>
                <IonText style={{ fontSize: 12 }} className='light-text'>{BodyParts[exercise.bodyPart]}</IonText>
            </div>
            {selectable ? <IonCheckbox onIonChange={e => OnIonChange(e.detail.checked)} checked={checked} slot='end' /> : null}
        </IonItem>
    )
}

interface ExerciseListHeaderProps {
    style: any,
    title: string
}
const ExerciseListHeader: React.FC<ExerciseListHeaderProps> = (props) => {
    return (
        <IonItem style={props.style} color='light' lines='none'>
            <IonText>{props.title}</IonText>
        </IonItem>
    )
}
export default ExerciseList

class ExerciseListFilter extends React.Component {
    static ref: ExerciseListFilter | null = null;
    state: {
        show: boolean,
        selectedBodyParts: string[],
        selectedCategories: string[],
        resolve: (res: { selectedBodyParts: string[], selectedCategories: string[] }) => void
    } = {
            show: false,
            selectedBodyParts: [],
            selectedCategories: [],
            resolve: () => { }
        }
    show(options: { selectedBodyParts?: string[], selectedCategories?: string[] }) {
        return new Promise<{ selectedBodyParts: string[], selectedCategories: string[] }>((resolve) => {
            let { selectedBodyParts, selectedCategories } = options
            this.setState({
                show: true,
                selectedBodyParts: selectedBodyParts || [],
                selectedCategories: selectedCategories || [],
                resolve: resolve
            })
        })
    }
    hide() {
        if (this.state.resolve) {
            this.state.resolve({
                selectedBodyParts: this.state.selectedBodyParts,
                selectedCategories: this.state.selectedCategories
            })
        }
        this.setState({
            show: false,
            selectedBodyParts: [],
            selectedCategories: []
        })
    }
    isSelected = (key: string, type: 'bodypart' | 'category') => {
        if (type === 'bodypart') {
            return this.state.selectedBodyParts.includes(key);
        } else {
            return this.state.selectedCategories.includes(key)
        }
    }
    onSelect = (key: string, type: 'bodypart' | 'category', val: boolean) => {
        if (val) {
            if (type === 'bodypart') {
                this.setState({
                    selectedBodyParts: this.state.selectedBodyParts.filter((f) => f != key)
                })
            } else {
                this.setState({
                    selectedCategories: this.state.selectedCategories.filter((f) => f != key)
                })
            }
        } else {
            if (type === 'bodypart') {
                this.setState({
                    selectedBodyParts: [...this.state.selectedBodyParts, key]
                })
            } else {
                this.setState({
                    selectedCategories: [...this.state.selectedCategories, key]
                })
            }
        }
    }
    render() {
        return (
            <IonModal isOpen={this.state.show}>
                <Header backIcon={close} title="Exercise Filter" backButton noborder onBack={() => {
                    this.hide()
                }} />
                <IonContent>
                    <IonItem lines='none'>
                        Filter by Body Parts
                    </IonItem>
                    <div style={{ flexDirection: 'row', flexWrap: 'wrap' }} className='centering-box'>
                        {Object.keys(BodyParts).map((k) => {
                            const selected = this.isSelected(k, 'bodypart')
                            return (
                                <IonChip onClick={() => {
                                    this.onSelect(k, 'bodypart', selected)
                                }} color={selected ? 'primary' : undefined} key={k}>
                                    {
                                        //@ts-ignore
                                        BodyParts[k]
                                    }
                                </IonChip>
                            )
                        })}
                    </div>
                    <IonItem lines='none'>
                        Filter by Categories
                    </IonItem>
                    <div style={{ flexDirection: 'row', flexWrap: 'wrap' }} className='centering-box'>
                        {Object.keys(ExerciseCategories).map((k) => {
                            const selected = this.isSelected(k, 'category')
                            return (
                                <IonChip onClick={() => {
                                    this.onSelect(k, 'category', selected)
                                }} color={selected ? 'primary' : undefined} key={k}>
                                    {
                                        //@ts-ignore
                                        ExerciseCategories[k]
                                    }
                                </IonChip>
                            )
                        })}
                    </div>
                </IonContent>
            </IonModal>
        )
    }
}

class CreateExerciseModal extends React.Component {
    static ref: CreateExerciseModal | null = null
    state = {
        show: false,
        exerciseName: '',
        category: '',
        bodyPart: ''
    }
    show() {
        this.setState({
            show: true
        })
    }
    CanSave() {
        let { exerciseName, category, bodyPart } = this.state
        return exerciseName !== "" && category !== "" && bodyPart !== ""
    }
    async CreateExercise() {
        let { exerciseName, category, bodyPart } = this.state
        try {
            Loader.show()
            await Exercise.Add(exerciseName, category, bodyPart)
            this.hide()
        } finally {
            Loader.hide()
        }
    }
    hide() {
        this.setState({
            show: false
        })
    }
    render() {
        return (
            <IonModal isOpen={this.state.show}>
                <Header onBack={this.hide.bind(this)} title="Create Exercise" noborder backButton backIcon={close}>

                </Header>
                <IonContent >
                    <IonItem style={{ marginTop: 16, '--padding-start': '16px' }} lines='none'>
                        <IonInput style={{ '--padding-start': '16px' }} onIonChange={e => this.setState({ exerciseName: e.detail.value })} value={this.state.exerciseName} mode='ios' placeholder='Enter Exercise Name' />
                    </IonItem>
                    <IonItem style={{ '--padding-start': '16px' }} lines='none'>
                        <IonSelect value={this.state.category} onIonChange={e => this.setState({ category: e.detail.value })} placeholder='Select Category' style={{ width: '100%' }} okText="Okay" cancelText="Dismiss">
                            {Object.keys(ExerciseCategories).map((ex) => {
                                return (
                                    //@ts-ignore
                                    <IonSelectOption value={ex}>{ExerciseCategories[ex]}</IonSelectOption>
                                )
                            })}
                        </IonSelect>
                    </IonItem>
                    <IonItem style={{ '--padding-start': '16px' }} lines='none'>
                        <IonSelect value={this.state.bodyPart} onIonChange={e => this.setState({ bodyPart: e.detail.value })} placeholder='Select Body Part' style={{ width: '100%' }} okText="Okay" cancelText="Dismiss">
                            {Object.keys(BodyParts).map((ex) => {
                                return (
                                    //@ts-ignore
                                    <IonSelectOption value={ex}>{BodyParts[ex]}</IonSelectOption>
                                )
                            })}
                        </IonSelect>
                    </IonItem>
                    <IonFab slot='fixed' vertical='bottom' horizontal='end'>
                        <IonFabButton onClick={this.CreateExercise.bind(this)} className={`${this.CanSave() ? '' : 'hidden'}`}>
                            <IonIcon icon={checkmark} />
                        </IonFabButton>
                    </IonFab>
                </IonContent>
            </IonModal>
        )
    }
}